import asyncio
from datetime import datetime
import logging

from aiohttp import ClientSession
from flask import jsonify

from .soliscloud_api import SoliscloudConfig, SoliscloudAPI
from .helper_db import HelperDB

class SolisCloudHelper:

    @classmethod
    async def get_latest_pv(cls, portal_domain, portal_username, portal_key_id, portal_secret, portal_plantid):
        logging.debug(f"Solar PV Data - {datetime.now()}")
        
        try:
            config = SoliscloudConfig(
                portal_domain,
                portal_username,
                portal_key_id,
                portal_secret,
                portal_plantid,
            )

            session = ClientSession()
            solis_api = SoliscloudAPI(config)

            retry = 0
            max_tries = 3
            save_data = False

            async def get_data():
                return await solis_api.login(session)

            while retry < max_tries:
                login = await get_data()
                logging.debug(f"login result - {login}")
                if login == False or login is None:
                    logging.error(
                        f"Failed Login - retry in 5 seconds - {datetime.now()}"
                    )
                    await asyncio.sleep(10)
                else:
                    save_data = True
                    break

                retry = retry + 1

            if save_data:
                logging.info(solis_api._data)
                HelperDB().post_pv(solis_api._data)

            await solis_api.logout()
            await session.close()

        except Exception as e:
            logging.error(f"FAILED PV - {datetime.now()} - {e}")
            return jsonify({"error": "Faied to create latest PV measurement data"}), 500

        return jsonify({"message": "SUCCESS"}, 201)