// Setup empty JS object to act as endpoint for all routes
projectData = [];

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require('body-parser')
    /* Middleware*/
    //Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
const { request } = require('http');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
const port = 3000;

/* Spin up the server*/
const server = app.listen(port, '192.168.1.80', listening);

function listening() {
    // console.log(server);
    console.log(`running on http://localhost:${port}`);
};

// GET route
app.get('/api/entry', sendData);

function sendData(request, response) {
    response.send(projectData);
};

// POST route

app.post('/api/entry', callBack);

function callBack(req, res) {
    const postData = req.body;

    const newData = {};
    newData.temp = postData.temp;
    newData.country = postData.country;
    newData.place = postData.place;
    newData.userResponse = postData.userResponse;
    newData.sunrise = postData.sunrise;
    newData.sunset = postData.sunset;
    newData.windspeed = postData.windspeed;
    newData.date = postData.date;
    newData.humidity = postData.humidity;
    newData.cloudiness = postData.cloudiness;

    projectData.push(newData);
    res.send(newData);
};