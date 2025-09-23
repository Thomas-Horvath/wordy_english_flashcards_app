server {
    listen 443 ssl;
    server_name wordy.thomasapi.eu www.wordy.thomasapi.eu;

    ssl_certificate /etc/letsencrypt/live/wordy.thomasapi.eu/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wordy.thomasapi.eu/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
