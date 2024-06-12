#!/bin/sh

# Directory where you want the backup files to be placed
backupdir="./backups"

# List all of the MySQL databases that you want to backup in here,
# each seperated by a space
databases=(goto_be_dev)

# MySQL dump command, use the full path name here
mysqldumpcmd="mysqldump"

# MySQL Username and password
userpassword=" --user=root --password=conthanlan"

# MySQL dump options
dumpoptions=" --quick --add-drop-table --add-locks --extended-insert --lock-tables"

# Get the current timestamp
TS=`date +%Y%m%d%H%M%S`

# Create our backup directory if not already there
mkdir -p ${backupdir}
if [ ! -d ${backupdir} ]
then
   echo "Not a directory: ${backupdir}"
   exit 1
fi

# Dump all of our databases
echo "Dumping MySQL Databases: ${backupdir}"
for database in $databases
do
   $mysqldumpcmd $userpassword $dumpoptions $database > ${backupdir}/${TS}-${database}.sql
done