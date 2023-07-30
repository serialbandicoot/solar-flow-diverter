#!/venv/bin/python

from dotenv import load_dotenv
from flask import Flask, Response
from flask_cors import CORS
from src.helper_db import HelperDB
import os, json

app = Flask(__name__)
app.config["CORS_HEADERS"] = "Content-Type"
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": ["http://127.0.0.1:3000", "http://api.solar-flow-diverter.uk"]
        }
    },
)

from flask import Flask, jsonify
from src.soliscloud_api import SoliscloudAPI, SoliscloudConfig
from config.config import load_config

@app.route("/", methods=["GET"])
async def get_home():
    return jsonify({"welcome": "solar-flow-diverter-api"})

@app.route("/v1/pv", methods=["GET"])
async def get_pv():
    return jsonify(HelperDB().get_last_pv())

@app.route("/v1/5d", methods=["GET"])
async def get_5d():
     return jsonify(HelperDB().get_last_5day())

@app.route("/v1/settings", methods=["GET"])
async def get_settings():
     return jsonify(HelperDB().get_settings())

def _read_json_file(file_path):
    with open(file_path, 'r') as file:
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


@app.after_request
def after_request(response: Response) -> Response:
    response.access_control_allow_origin = "*"
    return response

if __name__ == "__main__":
    app.run(host="0.0.0.0")
