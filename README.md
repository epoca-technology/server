# Server

Epoca Server is a program dedicated to interacting with the production server running the platform.

#
## Getting Started

- Create the dyno

- Upgrade/update apt and apt-get

- Install node, npm and n version manager

- Install docker

- Setup swap file

- Push source code

- Push env file

- Install compose's dependencies with `npm install`

- Build/start containers

- Setup cloudflare tunnel

- Create database backup cron job

- Create containers restart cron job



#
## Server CLI

### Server

`connect_to_server:` Opens a SSH connection with a server.

`reboot_server:` Reboots the server.

`shutdown_server:` Shuts down the server.

### Compose

`up_prod:` Starts the containers.

`build_prod`: Builds and starts the containers.

`debug_mode_prod:` Builds and starts the containers in debug mode.

`restore_mode_prod:` Builds and starts the containers in restore mode.

`down:` Stops the containers.

`restart:` Stops and starts all the containers.

`prune:` Removes all the dangling images and containers.

`database_backup:` Creates a backup of the database and uploads it to Firebase Storage.

`database_restore:` Restores a database backup currently stored in Firebase Storage.

### Push

`push_compose:` Pushes the compose's source code to the server.

`push_api:` Pushes the api's source code to the server.

`push_prediction_api:` Pushes the prediction api's source code to the server.

`push_gui:` Pushes the gui's source code to the server.

`push_all_source_code:` Pushes all the source code 1 by 1 to the server.

`push_env:` Pushes the environment file to the server.


#
## Swap File

https://www.digitalocean.com/community/questions/can-not-install-tensorflow

https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-22-04






#
## Cron Jobs

### Database Backup Script (Daily)

Create the database backup script: `touch database_backup.sh`

**Content ->** cd /root/compose && npm run database-backup

### Compose Restart Script (Weekly)

Create the compose restart script: `touch compose_restart.sh`

**Content ->** cd /root/compose && npm run restart


### Permissions

Assign the permissions to the scripts with: 

`chmod u+x database_backup.sh`

`chmod u+x compose_restart.sh`

### Cron Job Registration

Run `crontab -e` and insert the following lines in the text file: 

`0 4 * * * /bin/sh /root/database_backup.sh`

`0 8 * * * /bin/sh /root/compose_restart.sh`


### Running Cron Jobs

`crontab -l`

### Erase Cron Tab

`crontab -r`

### Logs

`grep CRON /var/log/syslog`

`grep crontab /var/log/syslog`




#
## Request Speed to Binance

curl -o /dev/null -s -w 'Total: %{time_total}s\n' https://www.binance.com/fapi/v1/depth?symbol=BTCUSDT&limit=50


curl https://www.binance.com/fapi/v1/depth?symbol=BTCUSDT&limit=50


#
## SSH Scripts

### Connect to the server

`ssh root@142.93.56.46`


Transfer Files

`scp ./epoch-builder/requirements.txt root@142.93.56.46:compose/.env`


Transfer Directories

`scp -r ./compose root@142.93.56.46:compose`

`scp -r ./gui-production root@142.93.56.46:gui-production`

`scp -r ./api-production root@142.93.56.46:api-production`

`scp -r ./prediction-api-production root@142.93.56.46:prediction-api-production`