/* Global Variables */
const API_KEY = 'd09f48689a0aa2d5636748f8b00f237e';

//Get Today Date
let d = new Date();
let today = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

//URL
const API_URL = "https://api.openweathermap.org/data/2.5/weather?";

// Async GET,Function to GET Web API Data
const getWeatherData = async(zipCode) => {
    const zipUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=${API_KEY}`;
    const request = await fetch(zipUrl);
    try {
        // Transform into JSON
        const allData = await request.json()
            // console.log(allData);
        return allData;
    } catch (error) {
        console.log("error", error);
        showMessage("OpenWeatherMap error, sorry");
        return null;
        // appropriately handle the error
    }
};

// Async POST
const postData = async(url = '', data = { temp, date, userResponse }) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header        
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        showMessage("Error on server, sorry! Please try again later");
        console.log("error", error);
    }
};

const generateData = () => {
    const zipCode = document.querySelector('#zip').value.trim();
    const feelings = document.querySelector('#feelings').value;
    getWeatherData(zipCode)
        .then(weatherData => {
            if (weatherData == null) {
                return null;
            }

            if (weatherData.cod != 200) {
                showMessage("Wrong zip code, please check");
            } else {
                postData("/api/entry", weatherApiToServer(weatherData, feelings))
                    .then(retrieveData("/api/entry"))
            }
        })
}

const weatherApiToServer = (weatherData, feelings) => {
    return {
        place: weatherData.name,
        date: today,
        country: weatherData.sys.country,
        cloudiness: weatherData.weather[0].description,
        //nearest integer
        humidity: `${Math.round(weatherData.main.humidity)} %`,
        windspeed: `${weatherData.wind.speed} mi/h`,
        temp: `${Math.round(weatherData.main.temp)} °F`,
        sunrise: UTC(weatherData.sys.sunrise),
        sunset: UTC(weatherData.sys.sunset),
        userResponse: feelings
    }
}

const showMessage = (message) => {
    document.querySelector("#message").innerHTML = message;
    document.querySelector("#message").classList.remove("hidden");
    document.querySelector("#weather-holder").classList.add("hidden");
}

document.getElementById('get-weather').addEventListener('submit', (event) => {
    event.preventDefault();
    generateData();
});

const UTC = (unixTime) => {
    const time = new Date(unixTime * 1000);
    return `${time.toUTCString().slice(17, 25)} GMT`;
}


// Function to GET Project Data
const retrieveData = async(url = '') => {
    const request = await fetch(url);
    try {
        // Transform into JSON
        const allData = await request.json()

        /* Update UI */
        updateUI(allData);

    } catch (error) {
        console.log("error", error);
        showMessage("Error on server, sorry! Please try again later");
        // appropriately handle the error
    }

};

/* Update danamic UI */
const updateUI = (allWeatherData) => {
    let weatherData = allWeatherData[allWeatherData.length - 1];
    const location = `${weatherData.place}, ${weatherData.country}`
    document.querySelector(".location").innerHTML = location;
    document.querySelector("#date").innerHTML = weatherData.date;
    document.querySelector("#temp").innerHTML = weatherData.temp;
    document.querySelector(".humidity").innerHTML = weatherData.humidity;
    document.querySelector(".cloudiness").innerHTML = weatherData.cloudiness;
    document.querySelector(".sunrise").innerHTML = weatherData.sunrise;
    document.querySelector(".sunset").innerHTML = weatherData.sunset;
    document.querySelector(".windspeed").innerHTML = weatherData.windspeed;
    document.querySelector(".user_respones").innerHTML = weatherData.userResponse;
    //after we populated the UI, we unhide the div with 
    document.querySelector("#message").classList.add("hidden");
    document.querySelector("#weather-holder").classList.remove("hidden");
}