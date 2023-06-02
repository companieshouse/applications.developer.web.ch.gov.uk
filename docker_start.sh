#!/bin/bash
#
# Start script for applications.developer.ch.gov.uk

PORT=3000

source "server/config/.env"
export NODE_PORT=${PORT}
node server.js
