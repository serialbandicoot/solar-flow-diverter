#!/venv/bin/python

from dotenv import load_dotenv
from flask import Flask, Response
from flask_cors import CORS

from src.metoffer import MetOffer
from src import metoffer
from src.helper_db import HelperDB

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
async def get_metoffice_data():
     return jsonify(HelperDB().get_5day())

@app.after_request
def after_request(response: Response) -> Response:
    response.access_control_allow_origin = "*"
    return response

if __name__ == "__main__":
    app.run(host="0.0.0.0")
