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
from src.soliscloud_helper import SolisCloudHelper
from src.solar_diverter import SolarDiverter, SolarDiverterOrder

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


# Temp!
def _read_json_file(file_path):
    with open(file_path, "r") as file:
        data = json.load(file)
    return data


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

        config = HelperDB().get_settings()
        M = metoffer.MetOffer(config["met_office_api_key"])
        bath = M.nearest_loc_forecast(
            float(config["lat"]), float(config["long"]), metoffer.DAILY
        )

        logging.info(bath)

        HelperDB().post_5day(bath)
    except Exception as e:
        logging.error(f"FAILED MO - {datetime.datetime.now()} - {e}")
        return jsonify({"error": "Failed to create MO Weather data"}), 500

    return {"message": "SUCCESS"}


@app.route("/v1/create_pv", methods=["GET"])
async def pv():
    config = HelperDB().get_settings()

    return await SolisCloudHelper.get_latest_pv(
        config["solis_domain"],
        config["solis_username"],
        config["solis_key_id"],
        config["solis_secret_key"].encode(),
        config["solis_station_id"],  # Provide Station and not Plant ID!
    )


@app.route("/v1/activation", methods=["POST"])
def post_activation():
    data = request.get_json()
    activation = data.get("activate")
    activation_type = data.get("type")
    if activation_type:
        try:
            config = HelperDB().get_settings()
            account_id = config["twillio_account_id"]
            auth_token = config["twillio_auth_token"]
            HelperDB().post_home_activations(activation_type, activation)
            SMS(account_id, auth_token).send(
                to="+447970062349",
                message_body=f"{activation_type} is now {activation}",
            )
            return jsonify({"message": "SUCCESS"}), 200
        except Exception as e:
            jsonify(
                {
                    "error": f"Activation type error {activation_type} not found with error {e}"
                }
            ), 500
    if data.get("excess_priority"):
        return jsonify(
            HelperDB().post_home_sensor_priority(data.get("excess_priority"))
        )

    return jsonify({"error": f"Activation type {activation_type} not created"}), 404


@app.route("/v1/activation", methods=["GET"])
def get_activation():
    return jsonify(HelperDB().get_home_activations()), 200


@app.route("/v1/solar_diverter", methods=["GET"])
def solar_diverter():
    excess_priority = HelperDB().get_home_activations()["excess_priority"]
    battery_threshold = excess_priority["battery_threshold"]
    water_threshold = excess_priority["water_threshold"]
    battery_reading = HelperDB().get_last_pv()["plant"][0]["remainingCapacity"]
    order = excess_priority["order"]
    full_order = SolarDiverterOrder().get_order(order)

    new_priority = SolarDiverter(full_order["1"], full_order["2"]).check_priority(
        battery_reading,
        battery_threshold=battery_threshold,
        water_threshold=water_threshold,
    )

    return (
        jsonify(
            {
                "success": "OK",
                "priority": order,
                "battery_reading": battery_reading,
                "new_priority": new_priority.to_s(),
            }
        ),
        200,
    )

@app.route('/v1/store_sunset_sunrise', methods=['GET'])
def store_sunset_sunrise():
    try:
        # Make a request to the sunrise and sunset API
        response = requests.get('https://api.sunrisesunset.io/json?lat=51.358433&lng=-2.374655')
        data = response.json()

        # Call the method directly on the instantiated object
        HelperDB().post_sunset_suntime(data)

        return jsonify({'message': 'Data successfully posted to the database'}), 200
    except Exception as e:
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500


@app.after_request
def after_request(response: Response) -> Response:
    response.access_control_allow_origin = "*"
    response.access_control_allow_headers = "*"
    return response


if __name__ == "__main__":
    app.run(host="0.0.0.0")
