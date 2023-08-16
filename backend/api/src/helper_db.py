import os, json
from tinydb import Query, TinyDB
from enum import Enum
from datetime import datetime, timedelta


class Store:
    PV = "pv_data_store"
    MO = "mo_data_store"
    ST = "settings"
    NO = "notifications"
    PR = "priorities"
    SS = "sunrise_sunset"

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

    def get_pv(self):
        def get_measurement_within_24_hours(data):
            current_time = datetime.now()
            start_time = datetime(
                current_time.year, current_time.month, current_time.day, 0, 0, 0
            )
            end_time = start_time + timedelta(days=1)
            filtered_data = [
                measurement
                for measurement in data
                if start_time
                <= datetime.strptime(measurement["timestamp"], "%Y-%m-%d %H:%M:%S.%f")
                < end_time
            ]

            return filtered_data

        def extract_timestamp_and_capacity(data):
            extracted_data = list(
                map(
                    lambda entry: {
                        "timestamp": entry["timestamp"],
                        "remainingCapacity": entry["plant"][0]["remainingCapacity"],
                    },
                    data,
                )
            )

            return extracted_data

        remaing_capacity_data = extract_timestamp_and_capacity(
            self._get_or_create(Store.PV).all()
        )
        todays_data = get_measurement_within_24_hours(remaing_capacity_data)

        return todays_data

    def post_settings(self, lat: str, long: str):
        store = self._get_or_create(Store.ST)
        record = self._get_last(store)
        
        # Limited to lat/long and stored as string
        record['lat']=lat
        record['long']=long

        store.update(record, doc_ids=[1])

        return self._get_last(store)

    def get_settings(self):
        store = self._get_or_create(Store.ST)

        return self._get_last(store)

    def post_notifications(self, notification_type: str, notification_value: bool):
        store = self._get_or_create(Store.NO)

        record = self._get_last(store)
        record["notifications"][notification_type] = notification_value
        record["timestamp"] = str(datetime.now())

        store.update(record, doc_ids=[1])

        return self._get_last(store)

    def get_notifications(self):
        store = self._get_or_create(Store.NO)

        return self._get_last(store)

    def post_sunrise_sunset(self, data):
        store = self._get_or_create(Store.SS)
        sunrise_sunset = {}
        sunrise_sunset["timestamp"] = str(datetime.now())
        sunrise_sunset["sunrise_sunset"] = data

        store.insert(sunrise_sunset)

    def get_last_sunrise_sunset(self):
        store = self._get_or_create(Store.SS)

        return self._get_last(store)

    def get_priorities(self):
        store = self._get_or_create(Store.PR)

        return self._get_last(store)

    def post_priorities(self, excess_priority: {}):
        store = self._get_or_create(Store.PR)
        record = self._get_last(store)
        if record:
            record["excess_priority"]["order"] = excess_priority["order"]
            record["excess_priority"]["battery_threshold"] = excess_priority[
                "battery_threshold"
            ]
            record["excess_priority"]["water_threshold"] = excess_priority[
                "water_threshold"
            ]

        record["timestamp"] = str(datetime.now())
        store.update(record, doc_ids=[1])

        return self._get_last(store)
