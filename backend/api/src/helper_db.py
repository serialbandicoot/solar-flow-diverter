import os, json
from tinydb import Query, TinyDB
from enum import Enum
from datetime import datetime


class Store:
    PV = "pv_data_store"
    MO = "mo_data_store"
    ST = "settings"
    HS = "home_sensor"

    def get_value(color_enum):
        if not isinstance(color_enum, Enum):
            raise ValueError("Argument must be an Enum member")
        return color_enum.name.lower()


class HelperDB:
    def _database_path(self):
        return os.path.join("~/data")

    def _get_or_create(self, store: str):
        db_path = os.path.expanduser(
            os.path.join(
                self._database_path(),
                f"{store}.json",
            )
        )
        return TinyDB(db_path)

    def _get_last(self, store):
        store = store.all()
        if len(store) == 0:
            return None
        return store[len(store) - 1]

    def post_5day(self, data):
        store = self._get_or_create(Store.MO)
        weather = {}
        weather["timestamp"] = str(datetime.now())
        weather["fiveDay"] = data

        store.insert(weather)

    def post_pv(self, data):
        store = self._get_or_create(Store.PV)
        plant = {}
        plant["timestamp"] = str(datetime.now())
        plant["plant"] = [data]

        store.insert(plant)

    def get_last_5day(self):
        store = self._get_or_create(Store.MO)

        return self._get_last(store)

    def get_last_pv(self):
        store = self._get_or_create(Store.PV)

        return self._get_last(store)

    def get_settings(self):
        store = self._get_or_create(Store.ST)

        return self._get_last(store)

    def post_home_sensor_priority(self, excess_priority: {}):
        store = self._get_or_create(Store.HS)
        first_and_last_record = self._get_last(store)
        if first_and_last_record:
            first_and_last_record["excess_priority"]["order"] = excess_priority["order"]
            first_and_last_record["excess_priority"][
                "battery_threshold"
            ] = excess_priority["battery_threshold"]
            first_and_last_record["excess_priority"][
                "water_threshold"
            ] = excess_priority["water_threshold"]

        first_and_last_record["timestamp"] = str(datetime.now())
        store.update(first_and_last_record, doc_ids=[1])

        return self._get_last(store)

    def post_home_activations(self, activate: str, activate_state: bool):
        store = self._get_or_create(Store.HS)
        first_and_last_record = self._get_last(store)
        if first_and_last_record:
            first_and_last_record["home_sensor"][activate] = activate_state
        else:
            first_and_last_record = {}
            first_and_last_record["home_sensor"] = {
                "bath": False,
                "home": False,
                "water": False,
                "heating": False,
            }
        first_and_last_record["timestamp"] = str(datetime.now())
        store.update(first_and_last_record, doc_ids=[1])

    def get_home_activations(self):
        store = self._get_or_create(Store.HS)

        return self._get_last(store)
