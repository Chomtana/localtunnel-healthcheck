# Localtunnel healthcheck

A tool for a powerful healthcheck and auto restart for localtunnel (Based on Chomtana modified version https://github.com/Chomtana/localtunnel-server).

It perform check every 10 seconds for high availability of the server.

## Setup

1. Clone this repository
2. Copy .env.example to .env and change `HOST` and `HEALTHCHECK path`
3. Run `./localtunnel-healthcheck/config.sh <subdomain>`
4. Add this script to cronjob by using `crontab -e` command and add `* * * * * node <path to cloned folder>`. For example `* * * * * node /home/pi/localtunnel-healthcheck`
