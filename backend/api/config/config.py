import os
from dotenv import load_dotenv


def load_config():
    try:
        load_dotenv()

        return {
            "key_id": os.environ.get("KEY_ID"),
            "secret_key": os.environ.get("SECRET_KEY").encode(),
            "plant_id": os.environ.get("PLANT_ID"),
            "station_id": os.environ.get("STATION_ID"),
            "sn": os.environ.get("SERIAL_NUMBER"),
            "portal_domain": os.environ.get("PORTAL_DOMAIN"),
            "portal_username": os.environ.get("PORTAL_USERNAME"),
            "met_office_api_key": os.environ.get("MET_OFFICE_API_KEY"),
            "lat": os.environ.get("LAT"),
            "long": os.environ.get("LONG"),
        }
    except Exception as e:
        print("Check for missing env", e)
