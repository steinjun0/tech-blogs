echo "0 0 * * * /bin/sh /container/next/update.sh" > /etc/cron.d/cronjob
chmod 0644 /etc/cron.d/cronjob
crontab /etc/cron.d/cronjob
cron