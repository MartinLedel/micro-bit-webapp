# micro:bits - webapp

This is a readme for setting up the webapp associated to a project regarding micro:bit sensors.
Some features are:

* Input measurements to get a copy of a real life room.
* Place sensors in a "room" for future reference where the user put the sensor.
* Show data from all sensor associated to that room or just an individual sensor.

![Screenshot of a microbit example](./img/microbit_showcase.png)

## Language

* HTML
* Javascript
* Node.js
* Express

## Installation

Start by checking if node and npm is installed.

```bash
node -v
npm -v
```

If node isn't installed, use this [link](https://nodejs.org/en/download/).
If just npm is missing it can be installed with:

```bash
[sudo] npm install npm -g
```

With that out of the way you have to install the modules from the package.json.

```bash
npm install
```

The webapp utilizes a database to push and pull data from. That has to be configured. Go to from the app root directory:
```
db/config.json
```
Here it will look like this:
```
{
    "host":     "remotemysql.com", //change to localhost for a local database.
    "port":     "3306", //Change to 8080 if you are using localhost.
    "user":     "krdhoQPq09", //Change to the local MySQL database username.
    "password": "sjMY2t9R4J", //Change to the local MySQL database password.
    "database": "krdhoQPq09", //Change to the local MySQL database name.
    "multipleStatements": true //Dont change.
}

```

With all of this out of the way you are now ready to go!

## Usage

To start the server use:
```bash
node index.js
```
Or if nodemon is installed:
```bash
npm start
```
