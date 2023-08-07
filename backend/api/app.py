#!/venv/bin/python

import asyncio
from aiohttp import ClientSession
from dotenv import load_dotenv
from flask import Flask, Response, request
from flask_cors import CORS
from src.sms import SMS
from src import soliscloud_api
from src.helper_db import HelperDB
import os, json, logging, datetime
from src import metoffer

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s %(levelname)s %(message)s",
    filename="/tmp/log/feeds.log",
)

app = Flask(__name__)
app.config["CORS_HEADERS"] = "Content-Type"
resources = {
    r"/v1/*": {
        "origins": ["http://127.0.0.1:3000", "http://api.solar-flow-diverter.uk"],
        "allow_headers": ["Content-Type"],
    }
}

CORS(app, resources=resources)

from flask import Flask, jsonify
from src.soliscloud_api import SoliscloudAPI, SoliscloudConfig
from config.config import load_config


@app.route("/", methods=["GET"])
def get_home():
    return jsonify({"welcome": "solar-flow-diverter-api"})


@app.route("/v1/pv", methods=["GET"])
def get_pv():
    return jsonify(HelperDB().get_last_pv())


@app.route("/v1/5d", methods=["GET"])
def get_5d():
    return jsonify(HelperDB().get_last_5day())


@app.route("/v1/settings", methods=["GET"])
def get_settings():
    return jsonify(HelperDB().get_settings())


def _read_json_file(file_path):
    with open(file_path, "r") as file:
        data = json.load(file)
    return data


@app.route("/v1/tank_schedule", methods=["GET"])
def mock_tank_schedule():
    # Assuming the 'schedule.json' file is in the 'mock_data' directory
    file_path = os.path.join("mock_data", "schedule.json")
    try:
        data = _read_json_file(file_path)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": "Schedule data not found"}), 404


@app.route("/v1/tank_latest_measurement", methods=["GET"])
def mock_tank_latest_measurement():
    # Assuming the 'latest_measurement.json' file is in the 'mock_data' directory
    file_path = os.path.join("mock_data", "latest_measurement.json")
    try:
        data = _read_json_file(file_path)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": "Latest measurement data not found"}), 404


@app.route("/v1/create_5d", methods=["GET"])
def create_5d():
    try:
        logging.debug(f"Get 5d Forecast - {datetime.datetime.now()}")

        config_values = load_config()
        M = metoffer.MetOffer(config_values["met_office_api_key"])
        bath = M.nearest_loc_forecast(
            float(config_values["lat"]), float(config_values["long"]), metoffer.DAILY
        )

        logging.info(bath)

        HelperDB().post_5day(bath)
    except Exception as e:
        logging.error(f"FAILED MO - {datetime.datetime.now()} - {e}")
        return jsonify({"error": "Failed to create MO Weather data"}), 500

    return {"message": "SUCCESS"}


@app.route("/v1/create_pv", methods=["GET"])
async def pv():
    logging.debug(f"Solar PV Data - {datetime.datetime.now()}")
    try:
        config_values = load_config()
        config = soliscloud_api.SoliscloudConfig(
            portal_domain=config_values["portal_domain"],
            portal_username=config_values["portal_username"],
            portal_key_id=config_values["key_id"],
            portal_secret=config_values["secret_key"],
            portal_plantid=config_values["station_id"],
        )

        session = ClientSession()
        solis_api = soliscloud_api.SoliscloudAPI(config)

        retry = 0
        max_tries = 3
        save_data = False

        async def get_data():
            return await solis_api.login(session)

        while retry < max_tries:
            login = await get_data()
            logging.debug(f"login result - {login}")
            if login == False or login is None:
                logging.error(
                    f"Failed Login - retry in 5 seconds - {datetime.datetime.now()}"
                )
                await asyncio.sleep(10)
            else:
                save_data = True
                break

            retry = retry + 1

        if save_data:
            logging.info(solis_api._data)
            HelperDB().post_pv(solis_api._data)

        await solis_api.logout()
        await session.close()

    except Exception as e:
        logging.error(f"FAILED PV - {datetime.datetime.now()} - {e}")
        return jsonify({"error": "Faied to create latest PV measurement data"}), 500

    return jsonify({"message": "SUCCESS"}, 201)


@app.route("/v1/activation", methods=["POST"])
def post_activation():
    data = request.get_json()
    activation = data.get("activate")
    activation_type = data.get("type")
    if activation_type:
        try:
            config_values = load_config()
            account_id = config_values["twillio_account_id"]
            auth_token = config_values["twillio_auth_token"]
            HelperDB().post_home_activations(activation_type, activation)
            SMS(account_id, auth_token).send(
                to="+447970062349",
                message_body=f"{activation_type} is now {activation}",
            )
            return jsonify({"message": "SUCCESS"}, 201)
        except Exception as e:
            jsonify(
                {"error": f"Activation type error {activation_type} not found with error {e}"}
            ), 500

    return jsonify({"error": f"Activation type {activation_type} not created"}), 404


@app.route("/v1/activation", methods=["GET"])
def get_activation():
    activation_type = request.args.get("type")
    if activation_type:
        return jsonify(HelperDB().get_home_activations(activation_type))

    return jsonify({"error": f"Activation type {activation_type} not found"}), 404


@app.after_request
def after_request(response: Response) -> Response:
    response.access_control_allow_origin = "*"
    response.access_control_allow_headers = "*"
    return response


if __name__ == "__main__":
    app.run(host="0.0.0.0")
