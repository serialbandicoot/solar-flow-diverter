#!/usr/bin/env python3
import datetime as dt

from scheduler.asyncio import Scheduler
from config.config import load_config
from src import soliscloud_api
from aiohttp import ClientSession
from src.helper_db import HelperDB
import asyncio
import logging

# Logger Stuff!
log_file = '/var/log/pv.log'
logger = logging.getLogger('pv_logger')
logger.setLevel(logging.DEBUG)
file_handler = logging.FileHandler(log_file)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

EPOC = 10

async def pv():
    logger.info(f"*** Solar PV Data - {dt.datetime.now()} ***")
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
        print(login)
        if login == False or login is None:
            print(f"*** Failed Login - retry in 5 seconds ***") 
            await asyncio.sleep(10)
        else:
            save_data = True
            break 

        retry = retry + 1  

    await solis_api.logout()
    await session.close()

    if save_data:
        HelperDB().post_pv(solis_api._data)

async def main():
    schedule = Scheduler()
    schedule.cyclic(dt.timedelta(minutes=EPOC), pv)
    
    logger.info(schedule)

    while True:
        await asyncio.sleep(1)

asyncio.run(main())

