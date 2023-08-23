#!/bin/bash

curl -X POST https://api.solar-flow-diverter.uk/v1/create_pv
curl -X POST -H "Content-Type: application/json" -d '{"step": "5d"}' https://api.solar-flow-diverter.uk/v1/weather
