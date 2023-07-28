import os, json
from pysondb import db
from enum import Enum
from datetime import datetime

class Store:
    PV = "pv_data_store"
    MO = "mo_data_store"
    ST = "settings_data_store"

    def get_value(color_enum):
        if not isinstance(color_enum, Enum):
            raise ValueError("Argument must be an Enum member")
        return color_enum.name.lower()

class HelperDB:

    def _database_path(self):
        return os.path.join("~/data")

    def _get_or_create(self, store: str):
        db_path = os.path.expanduser(os.path.join(
            self._database_path(),
            f"{store}.json",
        ))
        return db.getDb(db_path)
    
    def _get_first(self, store):
        store = store.get()
        if len(store) != 1:
            return None
        return store[0]

    def post_5day(self, data):
        store = self._get_or_create(Store.MO)   
        weather = {}
        weather["timestamp"] = str(datetime.now())  
        weather["fiveDay"] = data

        store.add(weather)

    def post_pv(self, data):
        store = self._get_or_create(Store.PV)   
        plant = {}
        plant["timestamp"] = str(datetime.now())   
        plant["plant"] = [
            data
        ]

        store.add(plant)

    def get_5day(self):
        store = self._get_or_create(Store.MO)
        
        return self._get_first(store)

    def get_last_pv(self):
        store = self._get_or_create(Store.PV)

        return self._get_first(store)


