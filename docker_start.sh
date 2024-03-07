#!/bin/bash
#
# Start script for applications.developer.ch.gov.uk
APPLICATIONS_DEVELOPER_WEB_PORT=3000
source "server/config/.env"
exec node server.js -- ${APPLICATIONS_DEVELOPER_WEB_PORT}
