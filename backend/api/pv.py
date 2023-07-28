import datetime as dt

from scheduler.asyncio import Scheduler
from config.config import load_config
from src import soliscloud_api
from aiohttp import ClientSession
from src.helper_db import HelperDB
import asyncio

EPOC = 5

async def pv():
    print(f"*** Solar PV Data - {dt.datetime.now()} ***")
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
    login = await solis_api.login(session)
    if login == False or login is None:
        print(f"*** Failed Login - retry in {EPOC} minutes ***")
        return 

    await solis_api.logout()
    await session.close()

    HelperDB().post_pv(solis_api._data)

async def main():
    schedule = Scheduler()
    schedule.cyclic(dt.timedelta(minutes=EPOC), pv)
    
    print(schedule)

    while True:
        await asyncio.sleep(1)

asyncio.run(main())

