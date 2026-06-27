#!/usr/bin/env sh
set -eu

cd /home/bu1ltwsl/portfolio-web

git pull origin main
npm install
npm run build
npm start

