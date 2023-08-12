ps aux | grep python | awk '{print $2}' | xargs kill
git pull
gunicorn -c gunicorn_config.py  app:app --access-logfile /tmp/log/solar-access.log