#!/usr/bin/env python3
import datetime as dt
import time
import logging

from scheduler import Scheduler
from config.config import load_config
from src.helper_db import HelperDB
from src import metoffer

EPOC = 5

# Logger Stuff!
log_file = '/var/log/mo.log'
logger = logging.getLogger('mo_logger')
logger.setLevel(logging.DEBUG)
file_handler = logging.FileHandler(log_file)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

def mo():
    logger.info(f"*** Get 5 Day Forecast - {dt.datetime.now()} ***")
    config_values = load_config()

    M = metoffer.MetOffer(config_values["met_office_api_key"])
    bath = M.nearest_loc_forecast(float(config_values["lat"]), float(config_values["long"]), metoffer.DAILY)

    HelperDB().post_5day(bath)

schedule = Scheduler()
schedule.cyclic(dt.timedelta(minutes=EPOC), mo)

logger.info(schedule)

while True:
    schedule.exec_jobs()
    time.sleep(1)

