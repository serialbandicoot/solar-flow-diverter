import datetime as dt
import time

from scheduler import Scheduler
from config.config import load_config
from src.helper_db import HelperDB
from src import metoffer

EPOC = 5

def mo():
    print(f"*** Get 5 Day Forecast - {dt.datetime.now()} ***")
    config_values = load_config()

    M = metoffer.MetOffer(config_values["met_office_api_key"])
    bath = M.nearest_loc_forecast(float(config_values["lat"]), float(config_values["long"]), metoffer.DAILY)

    HelperDB().post_5day(bath)

schedule = Scheduler()
schedule.cyclic(dt.timedelta(minutes=EPOC), mo)

print(schedule)

while True:
    schedule.exec_jobs()
    time.sleep(1)

