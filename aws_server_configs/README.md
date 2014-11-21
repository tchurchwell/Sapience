#Deployment Readiness for NODE APPS
Applications created with node.js architecture should be easily deployable with a small set of instructions.  The distributable Release Package should be in the form of a single Compressed (ZIP, GZIP, TAR, other) format and stored in the *local code repository. a URL link to the proper release candidate build should be provided to deployment engineer in release instructions so there is no confusion as to the build number, date, release version, etc.. 

##Instructions:

Assume Prerequisites: (node, npm, grunt, grunt-cli, forever, bower, etc;  all installed as root admin AND globally).

Single File Distributable

Deployment instructions simple enough for a Jr. Engineer to read and follow and be successful.

Environment Configuration files with specific connection strings for each target environment  (DEV, TEST, BASE, PROD). 

Database

Logging

Integrations

Server Start / Stop commands built into the application package (ex.  forever). 

Shell scripts, single line commands, or systemD files with instructions for an administrator.

Standard deployment folder location   (ex. /servers/code/application/)


*Local repository should be Nexxus or other central storage repo.

 

##Security Guidelines:
<< INSERT SECURITY POLICY GUIDELINES HERE >>

Storage / access of secret keys
Environment specific configurations for Database users / passwords

Sample Upstart Script: 

	description "node.js server application name here"
	author "Joe Developer<joedev@test.com>"

	start on stopped rc RUNLEVEL=[345]
	stop on started rc RUNLEVEL=[016] respawn
	respawn limit 5 3

	env NODE_HOME=/data/server/appname
	env APP_NAME=appname
	env NODE_ENV=production script

	NODE_ENV=$NODE_ENV << EOF >> /var/log/$APP_NAME.log 2>&1
	cd $NODE_HOME/$APP_NAME
	npm start
	EOF
	end script

	
Location: 
Save above script file:  'app_name.conf ' file goes on the server in the /etc/init/ folder on the server.

 

Upstart Commands:

	/sbin/status app_name 
	/sbin/start app_name
	/sbin/stop app_name

 

Validate Running Node Server Process:

	netstat -nlp | grep 3010        (substitute 3010 for your app port)

 

You should see something to this effect on the console:
root@ip-10-10-10-10 ~]# netstat -nlp | grep 27017
tcp 0 0 0.0.0.0:27017 0.0.0.0:* LISTEN 25112/app_name
unix 2 [ ACC ] STREAM LISTENING 35601 25112/mongod /tmp/mongodb-27017.sock


Additional Code Notes:

	init.d  command files are 755

	init config files are 644

run this command as root / sudo su -
	
	service sapience start

	strace initctl start sapience

	/sbin/start sapience
	/sbin/status sapience
	/sbin/status sapience
