subdomain=$(cat /home/pi/localtunnel-healthcheck/subdomain)
status_code=$(curl --write-out %{http_code} --silent --output /dev/null http://$subdomain.lt.airin1.com/healthcheck)

if [[ "$status_code" -ne 200 ]] ; then
  pm2 restart nodered-localtunnel
else
  echo "Healthcheck OK"
fi
