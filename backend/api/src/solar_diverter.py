from enum import Enum


class Priority(Enum):
    ONE = 1
    TWO = 2
    GRID = 3


class SelectionOption(Enum):
    BATTERY = 1
    WATER = 2
    GRID = 3


class SolarDiverter:
    def __init__(
        self, priority_one=SelectionOption.BATTERY, priority_two=SelectionOption.WATER
    ):
        self.priorities = {
            Priority.ONE: priority_one,
            Priority.TWO: priority_two,
            Priority.GRID: SelectionOption.GRID,
        }

    def check_priority(
        self,
        battery_reading=0,
        water_reading=0,
        battery_threshold=95,
        water_threshold=95,
    ):
        if (
            battery_reading > 100
            or water_reading > 100
            or battery_threshold > 100
            or water_threshold > 100
        ):
            raise ValueError("Readings cannot be greater than 100")

        # todo: consider max might be slightly-less than 100
        #       as the battery has to be approx 99/100
        #       and it automically psuhes the grid. To force
        #       diversion a tank-heating cycle is required.
        if water_reading >= 100 and battery_reading == 100:
            return SelectionOption.GRID

        priority_one = self.priorities[Priority.ONE]

        if priority_one == SelectionOption.BATTERY:
            # Standard
            if battery_reading <= battery_threshold:
                return SelectionOption.BATTERY

            if battery_reading > battery_threshold:
                if water_reading <= water_threshold:
                    return SelectionOption.WATER

        if priority_one == SelectionOption.WATER:
            # Reversed
            if water_reading <= water_threshold:
                return SelectionOption.WATER

            if water_reading > water_threshold:
                if battery_reading <= battery_threshold:
                    return SelectionOption.BATTERY

        return SelectionOption.GRID
