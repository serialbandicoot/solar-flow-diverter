#!/bin/bash

curl -X GET c/v1/create_pv
curl -X POST -H "Content-Type: application/json" -d '{"step": "5d"}' http://localhost:5000/v1/weather