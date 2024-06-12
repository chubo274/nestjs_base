#!/bin/bash

# if run with production mode
if [ "${1}" = "production" ]; then
    echo "Starting in production mode"

    sleep 20s
    prisma migrate deploy

    node dist/src/main.js
fi

# if run with
# development mode
if [ "${1}" = "development" ]; then
    echo "Starting in development mode"

    sleep 20s
    npx prisma migrate dev

    yarn start:dev
fi
