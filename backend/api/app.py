#!/venv/bin/python

import asyncio
from aiohttp import ClientSession
from flask import Flask, Response, request
from flask_cors import CORS
from src.sms import SMS

from src.helper_db import HelperDB
import os, json, logging, datetime, requests
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


@app.route("/v1/all_pv", methods=["GET"])
def get_all_pv():
    return jsonify(HelperDB().get_pv())

@app.route("/v1/settings", methods=["POST"])
def post_settings():
    data = request.get_json()

    return jsonify(HelperDB().post_settings(data['lat'], data['long']))

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


@app.route("/v1/weather", methods=["GET"])
def get_weather():
    step = request.args.get('step')
    if step == "5d":
        return jsonify(HelperDB().get_last_5day())
    elif step == "3h":
        return jsonify(HelperDB().get_last_3hr())

    return jsonify({"error": f"Weather step not found {step}"}), 404 

@app.route("/v1/weather", methods=["POST"])
def create_5d():
    data = request.get_json()
    step_option = data["step"] 
    if step_option == "5d":
        step = metoffer.DAILY
    elif step_option == "3h":
        step = metoffer.HOURLY
    else:
         return jsonify({"error": "Failed to create select a MO Weather Option"}), 500 

    try:
        logging.debug(f"Get 5d Forecast - {datetime.datetime.now()}")

        config = HelperDB().get_settings()
        M = metoffer.MetOffer(config["met_office_api_key"])
        location = M.nearest_loc_forecast(
            float(config["lat"]), float(config["long"]), step
        )

        logging.info(location)

        if step_option == "5d":
            HelperDB().post_5day(location)
        elif step_option == "3h":
            HelperDB().post_3hour(location)

    except Exception as e:
        logging.error(f"FAILED MO - {datetime.datetime.now()} - {e}")
        return jsonify({"error": "Failed to create MO Weather data"}), 500

    return {"message": f"SUCCESS >> {step}"}


@app.route("/v1/create_pv", methods=["POST"])
async def pv():
    config = HelperDB().get_settings()

    return await SolisCloudHelper.get_latest_pv(
        config["solis_domain"],
        config["solis_username"],
        config["solis_key_id"],
        config["solis_secret_key"].encode(),
        config["solis_station_id"],  # Provide Station and not Plant ID!
    )


@app.route("/v1/priorities", methods=["POST"])
def post_activation():
    data = request.get_json()
    last_update = HelperDB().post_priorities(data["excess_priority"])

    return jsonify(last_update)


@app.route("/v1/priorities", methods=["GET"])
def get_activation():
    return jsonify(HelperDB().get_priorities()), 200


@app.route("/v1/notifications", methods=["GET"])
def get_notifications():
    return jsonify(HelperDB().get_notifications()), 200


@app.route("/v1/notifications", methods=["POST"])
def post_notifications():
    data = request.get_json()
    notification_type = data.get("notification_type")
    notification_value = data.get("notification_value")

    return (
        jsonify(HelperDB().post_notifications(notification_type, notification_value)),
        200,
    )


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


@app.route("/v1/sunrise_sunset", methods=["POST"])
def post_sunrise_sunset():
    try:
        config = HelperDB().get_settings()
        response = requests.get(
            f"https://api.sunrisesunset.io/json?lat={config['lat']}&lng={config['long']}"
        )
        data = response.json()
        HelperDB().post_sunrise_sunset(data)
        return jsonify({"message": "Data successfully posted to the database"}), 200
    except Exception as e:
        return jsonify({"message": "An error occurred", "error": str(e)}), 500


@app.route("/v1/sunrise_sunset", methods=["GET"])
def get_sunrise_sunset():
    last_sunrise_sunset = HelperDB().get_last_sunrise_sunset()
    if last_sunrise_sunset is None:
        return jsonify({"error": "Sunrise data not found"}), 404
    return jsonify(last_sunrise_sunset), 200


@app.route("/v1/schedule", methods=["GET"])
def get_schedule():
    schedule_data = {"hello": "world"}
    return jsonify(schedule_data)


@app.after_request
def after_request(response: Response) -> Response:
    response.access_control_allow_origin = "*"
    response.access_control_allow_headers = "*"
    return response


if __name__ == "__main__":
    app.run(host="0.0.0.0")
