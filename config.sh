echo $1 > subdomain
pm2 delete nodered-localtunnel
pm2 start lt --name "nodered-localtunnel" -- --host http://lt.airin1.com --port 1880 --subdomain $1
pm2 save