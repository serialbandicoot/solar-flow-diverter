import pytest
from api.src.solar_diverter import SolarDiverter, Priority, SelectionOption


def test_default():
    expected_priority = "BATTERY"
    sd = SolarDiverter()

    actual_priority = sd.check_priority()

    assert expected_priority == actual_priority.name


def test_water_and_battery_100():
    expected_priority = "GRID"
    sd = SolarDiverter()

    actual_priority = sd.check_priority(water_reading=100, battery_reading=100)

    assert expected_priority == actual_priority.name


def test_battery_to_water_standard_within_range():
    expected_priority = "BATTERY"
    sd = SolarDiverter()

    actual_priority = sd.check_priority(battery_reading=5)

    assert expected_priority == actual_priority.name


def test_battery_to_water_standard_within_range_plus_new_battery_threshold():
    expected_priority = "BATTERY"
    sd = SolarDiverter()

    actual_priority = sd.check_priority(battery_reading=5, battery_threshold=50)

    assert expected_priority == actual_priority.name


def test_battery_to_water_standard_within_range_plus_over_battery_threshold_():
    expected_priority = "WATER"
    sd = SolarDiverter()

    actual_priority = sd.check_priority(battery_reading=85, battery_threshold=80)

    assert expected_priority == actual_priority.name


def test_battery_to_water_standard_within_range_plus_over_battery_threshold_():
    expected_priority = "WATER"
    sd = SolarDiverter()

    actual_priority = sd.check_priority(battery_reading=85, battery_threshold=80)

    assert expected_priority == actual_priority.name


def test_battery_to_water_standard_within_range_plus_over_battery_threshold_():
    expected_priority = "WATER"
    sd = SolarDiverter()

    actual_priority = sd.check_priority(battery_reading=85, battery_threshold=80)

    assert expected_priority == actual_priority.name


test_data = [
    (50, 0, 50, 0, "BATTERY", "Battery Reading is same than Battery threshold"),
    (50, 0, 51, 0, "BATTERY", "Battery Reading is lower than Battery threshold"),
    (51, 50, 50, 50, "WATER", "Battery has reached threshold, water has not"),
    (51, 50, 50, 51, "WATER", "Battery has reached threshold, water has not"),
    (51, 51, 50, 50, "GRID", "Battery and Water has reached threshold, default Grid"),
]


@pytest.mark.parametrize("br, wr, bt, wt, expected_priority, comments", test_data)
def test_all_params(br, wr, bt, wt, expected_priority, comments):
    sd = SolarDiverter()

    actual_priority = sd.check_priority(
        battery_reading=br, water_reading=wr, battery_threshold=bt, water_threshold=wt
    )

    assert expected_priority == actual_priority.name, comments


test_data_reversed = [
    (0, 50, 0, 50, "WATER", "Water Reading is same than Water threshold"),
    (0, 50, 0, 51, "WATER", "Water Reading is lower than Water threshold"),
    (0, 51, 50, 0, "BATTERY", "Water has reached threshold, Battery has not"),
    (40, 53, 50, 51, "BATTERY", "Water has reached threshold, Battery has not"),
    (51, 51, 50, 50, "GRID", "Battery and Water has reached threshold, default Grid"),
]
@pytest.mark.parametrize("br, wr, bt, wt, expected_priority, comments", test_data_reversed)
def test_all_params_reversed(br, wr, bt, wt, expected_priority, comments):
    sd = SolarDiverter(SelectionOption.WATER, SelectionOption.BATTERY)

    actual_priority = sd.check_priority(
        battery_reading=br, water_reading=wr, battery_threshold=bt, water_threshold=wt
    )

    assert expected_priority == actual_priority.name, comments


@pytest.mark.parametrize(
    "br, wr, bt, wt",
    [
        (101, 0, 0, 0),
        (0, 101, 0, 0),
        (0, 0, 101, 0),
        (0, 0, 0, 101),
    ],
)
def test_bad_reading(br, wr, bt, wt):
    sd = SolarDiverter()

    with pytest.raises(ValueError) as e:
        sd.check_priority(br, wr, bt, wt)

    assert str(e.value) == "Readings cannot be greater than 100"
