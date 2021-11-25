#!/usr/bin/env bash

cd "$(dirname "$0")"
cd ../zkFiles
http-server -p 8000 --cors

