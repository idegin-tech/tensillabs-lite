#!/bin/bash
# Start MongoDB in background
mongod --fork --logpath /var/log/mongodb.log --dbpath /data/db

# Wait for MongoDB to be ready
while ! nc -z localhost 27017; do sleep 1; done

# Start your app
node dist/main
