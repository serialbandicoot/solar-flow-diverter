#!/venv/bin/python

import os
from dotenv import load_dotenv
from aiohttp import ClientError, ClientSession
from flask import Flask
from flask_cors import CORS, cross_origin
import json

from requests import Response
from api.src.metoffer import MetOffer
from api.src import metoffer


app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app)

# Load environment variables from .env file
load_dotenv()

from flask import Flask, jsonify
from api.src.soliscloud_api import SoliscloudAPI, SoliscloudConfig
from api.config.config import load_config


@app.route("/api/get_inverter_detail", methods=["GET"])
async def get_inverter_detail():

    config_values = load_config()

    config = SoliscloudConfig(
        portal_domain=config_values["portal_domain"],
        portal_username=config_values["portal_username"],
        portal_key_id=config_values["key_id"],
        portal_secret=config_values["secret_key"],
        portal_plantid=config_values["station_id"]
    )

    session = ClientSession()
    solis_api = SoliscloudAPI(config)
    login = await solis_api.login(session)
    if login == False or login is None:
        return jsonify({"login": False})
    
    solis_api.logout()
    session.close()

    return jsonify({"login": login, "plant": solis_api._data})  
    
@app.route("/api/get_metoffice_data", methods=["GET"])
async def get_metoffice_data():

    print("START")	
    config_values = load_config()
    
    M = MetOffer(config_values['met_office_api_key'])
    bath = M.nearest_loc_forecast(51.358433, -2.374655, metoffer.DAILY)
    
    print("END")
	

    return jsonify(bath)

@app.after_request
def after_request(response: Response) -> Response:
    response.access_control_allow_origin = "*"
    return response

if __name__ == "__main__":
    app.run(debug=True)

