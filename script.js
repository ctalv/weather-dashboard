var searchInputEl = document.querySelector('.search-bar');
var searchButtonEl = document.querySelector('.search-button');
var cityBtnEl = document.querySelector('#city-buttons');
var dailyDivEl = document.querySelector('.daily');
var forecastDivEl = document.querySelector('.forecast');
var degSym = String.fromCharCode('176');

// checks if city list is in local storage already or not
if ((localStorage.getItem('cityListStored') === null)) {
    var cityList = [];
} else {
    var cityList = window.localStorage.getItem('cityListStored');
    cityList = cityList.split(',');
    createCityListButtons();
}

// creates the list of cities and adds buttons to page from what is stored in local storage
function createCityListButtons() {
    for (i = 0; i < cityList.length; i++) {
        var btnEl = document.createElement('button');
        btnEl.textContent = cityList[i];
        btnEl.classList.add('button');
        btnEl.classList.add('is-medium');
        cityBtnEl.appendChild(btnEl);
        btnEl.addEventListener('click', buttonClickHandler);
    }
}

// adds a newly searched city as a button
function addCityToList(cityName) {
    var btnEl = document.createElement('button');
    btnEl.textContent = cityName;
    btnEl.classList.add('button');
    btnEl.classList.add('is-medium');
    cityBtnEl.appendChild(btnEl);
}

// for when user inputs a city 
var formSubmitHandler = function (event) {
    event.preventDefault();
    var city = searchInputEl.value;
    searchInputEl.value = '';
    // checks if user inputed a city or left it blank
    if (city) {
        getCityLatLon(city);
    } else {
        return
    }

};

// for when user presses search
var buttonClickHandler = function (event) {
    var cityBtnName = event.target.textContent;
    getCityLatLon(cityBtnName);

};

// removes any displayed data
var removeHTML = function () {
    dailyDivEl.textContent = '';
    forecastDivEl.textContent = '';
}

// pulls the latititude and longitude based on the user inputed city
var getCityLatLon = function (city) {

    var apiZip = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=a62c7d10877c661b208fffa0f58b2658';

    removeHTML();

    fetch(apiZip)
        .then(function (response) {
            if (response.status !== 200) {
                alert('Please enter a valid city name.');
            } else if (response.status >= 500) {
                alert('Sorry! Servers are down! Please try again later.');
            } else {
                response.json().then(function (data) {

                    var lat = data[0].lat;
                    var lon = data[0].lon;
                    var cityName = data[0].name;

                    getWeather(lat, lon, cityName);
                    compareList(cityName);

                })
            };


        })
}

// pulls the weather data based on the latitude and longitude pulled earlier
var getWeather = function (lat, lon, city) {

    var apiLatLon = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=a62c7d10877c661b208fffa0f58b2658';

    fetch(apiLatLon)
        .then(function (response) {
            if (response.status !== 200) {
                alert('Please enter a valid city name.');
            } else if (response.status >= 500) {
                alert('Sorry! Servers are down! Please try again later.');
            } else {
                response.json().then(function (data) {

                    displayDailyWeather(data, city);
                    displayForecast(data);

                })
            };


        })
}

// checks if searched city is already in city list or not
var compareList = function (cityName) {
    var inList = [];

    for (i = 0; i < cityList.length; i++) {
        if (cityName === cityList[i]) {
            inList++;
        }
    }

    if (inList !== 1) {
        saveCity(cityName);
        addCityToList(cityName);
    }

}

// saves a newly searched city to local storage city list
var saveCity = function (cityName) {

    cityList.push(cityName);
    window.localStorage.setItem('cityListStored', cityList);

}

// displays today's weather data 
// city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the the wind speed
var displayDailyWeather = function (data, city) {

    // index and grab needed data
    var cityName = city;
    var unixDay = data.list[0].dt;
    var day = dayjs.unix(unixDay).format('MM-DD-YY');
    var iconCode = data.list[0].weather[0].icon;
    var weather = data.list[0].main;
    var tempK = weather.temp;
    var tempF = Math.round(((tempK - 273.15) * (9 / 5)) + 32);
    var humidity = weather.humidity;
    var windSpeed = (data.list[0].wind.speed);

    // create HTML elements
    var divEl = document.createElement('div')
    var h2El = document.createElement('h2')
    var h3El = document.createElement('h3');
    var olEl = document.createElement('ol');
    var tempEl = document.createElement('li');
    var humidityEl = document.createElement('li');
    var windEl = document.createElement('li');

    // icon display
    var iconEl = document.createElement('img');
    var iconSrc = 'https://openweathermap.org/img/wn/' + iconCode + '@2x.png';
    iconEl.setAttribute('id', 'wicon');
    iconEl.setAttribute('src', iconSrc);
    iconEl.setAttribute('alt', 'weather icon');

    h2El.setAttribute('class', 'title is-2 hero');
    olEl.setAttribute("style", "list-style-type:none");
    divEl.setAttribute('class', 'content is-medium');

    h2El.textContent = 'Today\'s Weather';
    h3El.textContent = cityName + ' ' + day;
    tempEl.textContent = 'Temp ' + tempF + ' ' + degSym + 'F';
    humidityEl.textContent = 'Humidity ' + humidity + '%';
    windEl.textContent = 'Windspeed ' + windSpeed + ' mps';

// add everything to page
    dailyDivEl.appendChild(h2El);
    dailyDivEl.appendChild(divEl);
    divEl.appendChild(h3El);
    divEl.appendChild(iconEl);
    divEl.appendChild(olEl);
    olEl.appendChild(tempEl);
    olEl.appendChild(humidityEl);
    olEl.appendChild(windEl);

}

// displays the 5 day forecast data
// date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
var displayForecast = function (data) {

    var h2El = document.createElement('h2');
    h2El.textContent = '5 Day Forecast';
    h2El.setAttribute('class', 'title is-2 hero');
    forecastDivEl.appendChild(h2El);

    var divMainEl = document.createElement('div');
    forecastDivEl.appendChild(divMainEl);
    // divMainEl.setAttribute('class', 'is-flex is-justify-content-space-between content is-medium');
    divMainEl.setAttribute('class', 'columns is-1 content is-medium');

    // to pull each day needed
    for (i = 0; i < data.list.length; i = i + 8) {

        var unixDay = data.list[i].dt;
        var day = dayjs.unix(unixDay).format('MM-DD-YY');
        var iconCode = data.list[i].weather[0].icon;
        var weather = data.list[i].main;
        var tempK = weather.temp;
        var tempF = Math.round(((tempK - 273.15) * (9 / 5)) + 32);
        var humidity = weather.humidity;
        var windSpeed = (data.list[i].wind.speed);

        var divEl = document.createElement('div');
        var h3El = document.createElement('h3');
        var olEl = document.createElement('ol');
        var tempEl = document.createElement('li');
        var humidityEl = document.createElement('li');
        var windEl = document.createElement('li');

        // icon display
        var iconEl = document.createElement('img');
        var iconSrc = 'https://openweathermap.org/img/wn/' + iconCode + '@2x.png';
        iconEl.setAttribute('id', 'wicon');
        iconEl.setAttribute('src', iconSrc);
        iconEl.setAttribute('alt', 'weather icon');

        divEl.setAttribute('class', 'column');
        olEl.setAttribute("style", "list-style-type:none");

        h3El.textContent = day;
        tempEl.textContent = 'Temp ' + tempF + ' ' + degSym + 'F';
        humidityEl.textContent = 'Humidity ' + humidity + '%';
        windEl.textContent = 'Windspeed ' + windSpeed + ' mps';

// add everything to page
        divMainEl.appendChild(divEl);
        divEl.appendChild(h3El);
        divEl.appendChild(iconEl);
        divEl.appendChild(olEl);
        olEl.appendChild(tempEl);
        olEl.appendChild(humidityEl);
        olEl.appendChild(windEl);
    }
}

// event listeners for clicking search button and pressing enter
searchButtonEl.addEventListener('click', formSubmitHandler);
searchInputEl.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault()
        searchButtonEl.click();
    }
});
// event listener for pressing a city button
cityBtnEl.addEventListener('click', buttonClickHandler);