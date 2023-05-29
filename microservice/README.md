# Envrionments:

MYSQL_HOST= ep-db-server-v2.mysql.database.azure.com
MYSQL_PORT= 3306
MYSQL_USER= epadmin
MYSQL_PASS= !!1234Ad
MYSQL_DB= ep_db

MYSQL_HOST = localhost
MYSQL_PORT = 3306
MYSQL_USER = <Your user here>
MYSQL_PASS = <Your Password here>
MYSQL_DB = ep_db

JWT_PRIVATE_KEY = AAJ-AWESOME-KEY

# Cookbook

## 1 
importer alle tables fra /start/mysql
## 2 importer alle roller
http://localhost:3001/api/create/role
{
    "role" : "customer"
}

http://localhost:3001/api/create/role
{
    "role" : "admin"
}

## 3 Importer brugere du har lyst til

http://localhost:3001/api/users

{
    "firstname": "Admin",
    "lastname": "Admin",
    "email": "aa@a.dk",
    "address": "address12",
    "postal": 1235,
    "phone": 12345679,
    "password": "1234",
    "isActive": false,
    "userRole": "admin"
}

## 4 (optional) Test email service

Indsæt en valid email, i email feltet:

http://localhost:3001/api/users

{
    "firstname": "Admin",
    "lastname": "Admin",
    "email": "Andreas1992@outlook.dk",
    "address": "address12",
    "postal": 1235,
    "phone": 12345679,
    "password": "1234",
    "isActive": false,
    "userRole": "admin"
}