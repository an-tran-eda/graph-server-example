#!/bin/bash
export URI=mongodb://localhost:27017/patreon
mongoexport --uri ${URI} -c users --out users.json --jsonArray --pretty
mongoexport --uri ${URI} -c businesses --out businesses.json --jsonArray --pretty