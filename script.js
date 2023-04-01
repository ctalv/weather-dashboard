var searchInputEl = document.querySelector('.search-bar')
var searchButtonEl = document.querySelector('.search-button')
var cityBtnEl = document.querySelector('#city-buttons')
var dailyDivEl = document.querySelector('.daily')
var forecastDivEl = document.querySelector('.forecast')
var degSym = String.fromCharCode('176');


if ((localStorage.getItem('cityListStored') === null)) {
    var cityList = [];
} else {
    var cityList = window.localStorage.getItem('cityListStored');
    cityList = cityList.split(',')
    createCityListButtons();
}


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

function addCityToList(cityName) {
    var btnEl = document.createElement('button');
    btnEl.textContent = cityName;
    btnEl.classList.add('button');
    btnEl.classList.add('is-medium');
    cityBtnEl.appendChild(btnEl);

}


var formSubmitHandler = function (event) {

    event.preventDefault();
    var city = searchInputEl.value
    searchInputEl.value = '';

    if (city) {
        getCityLatLon(city);
    } else {
        alert('Enter a city.')
    }

};


var buttonClickHandler = function (event) {
    var cityBtnName = event.target.textContent;

    getCityLatLon(cityBtnName)

};

var removeHTML = function () {
    dailyDivEl.textContent = ''
    forecastDivEl.textContent = ''
}

var getCityLatLon = function (city) {

    var apiZip = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=a62c7d10877c661b208fffa0f58b2658';


    removeHTML()

    // fetch(apiZip)
    //     .then(function (response) {
    //         if (response.ok) {
    //             response.json().then(function (data) {

    //                 var lat = data[0].lat;
    //                 var lon = data[0].lon;
    //                 var cityName = data[0].name;

    //                 getWeather(lat, lon, cityName)
    //                 compareList(cityName)
    //             });
    //         } else {


    //         }

    //     })

        fetch(apiZip)
        .then(function (response) {

            if (response.status !== 200) {
                alert('Please enter a valid city name.')

            } else {
                response.json().then(function (data) {

                    var lat = data[0].lat;
                    var lon = data[0].lon;
                    var cityName = data[0].name;

                    getWeather(lat, lon, cityName)
                    compareList(cityName)

                })
            };


        })
}


var getWeather = function (lat, lon, city) {

    var apiLatLon = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=a62c7d10877c661b208fffa0f58b2658'

    fetch(apiLatLon)
        .then(function (response) {
            if (response.status !== 200) {
                alert('Please enter a valid city name.')

            } else {
                response.json().then(function (data) {

                    displayDailyWeather(data, city);
                    displayForecast(data)

                })
            };


        })
}

var compareList = function (cityName) {
    var inList = [];


    for (i = 0; i < cityList.length; i++) {

        if (cityName === cityList[i]) {
            inList++
        }
    }


    if (inList === 1) {

    } else {
        saveCity(cityName)
        addCityToList(cityName)
    }

}


var saveCity = function (cityName) {

    cityList.push(cityName)

    window.localStorage.setItem('cityNameStored', cityName)
    window.localStorage.setItem('cityListStored', cityList)

}



// city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the the wind speed
var displayDailyWeather = function (data, city) {

    //
    var cityName = city
    var unixDay = data.list[0].dt
    var day = dayjs.unix(unixDay).format('MM-DD-YY');
    var iconCode = data.list[0].weather[0].icon
    var weather = data.list[0].main
    var tempK = weather.temp
    var tempF = Math.round(((tempK - 273.15) * (9 / 5)) + 32);
    var humidity = weather.humidity;
    var windSpeed = (data.list[0].wind.speed)

    var divEl = document.createElement('div')
    var h2El = document.createElement('h2')
    var h3El = document.createElement('h3');
    var olEl = document.createElement('ol');
    var tempEl = document.createElement('li');
    var humidityEl = document.createElement('li');
    var windEl = document.createElement('li')

    // icon stuff
    var iconEl = document.createElement('img');
    var iconSrc = 'http://openweathermap.org/img/wn/' + iconCode + '@2x.png'
    iconEl.setAttribute('id', 'wicon')
    iconEl.setAttribute('src', iconSrc)
    iconEl.setAttribute('alt', 'weather icon')

    olEl.setAttribute("style", "list-style-type:none")
    divEl.setAttribute('class', 'content is-medium')

    h2El.setAttribute('class', 'title is-2 hero')

    h2El.textContent = 'Today\'s Forecast'
    h3El.textContent = cityName + ' ' + day
    tempEl.textContent = 'Temp ' + tempF + ' ' + degSym + 'F';
    humidityEl.textContent = 'Humidity ' + humidity + '%';
    windEl.textContent = 'Windspeed ' + windSpeed + ' mps';



    dailyDivEl.appendChild(h2El);
    dailyDivEl.appendChild(divEl);
    divEl.appendChild(h3El);
    divEl.appendChild(iconEl);
    divEl.appendChild(olEl);
    olEl.appendChild(tempEl);
    olEl.appendChild(humidityEl);
    olEl.appendChild(windEl);

}

//  5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
var displayForecast = function (data) {


    var h2El = document.createElement('h2')
    h2El.textContent = '5 Day Forecast'
    h2El.setAttribute('class', 'title is-2 hero')
    forecastDivEl.appendChild(h2El)

    var divMainEl = document.createElement('div')
    forecastDivEl.appendChild(divMainEl)
    divMainEl.setAttribute('class', 'is-flex is-justify-content-space-between content is-medium')

    for (i = 0; i < data.list.length; i = i + 8) {

        var unixDay = data.list[i].dt
        var day = dayjs.unix(unixDay).format('MM-DD-YY');
        var iconCode = data.list[i].weather[0].icon
        var weather = data.list[i].main
        var tempK = weather.temp
        var tempF = Math.round(((tempK - 273.15) * (9 / 5)) + 32);
        var humidity = weather.humidity;
        var windSpeed = (data.list[i].wind.speed)

        var divEl = document.createElement('div')
        var h3El = document.createElement('h3');
        var olEl = document.createElement('ol');
        var tempEl = document.createElement('li');
        var humidityEl = document.createElement('li');
        var windEl = document.createElement('li')

        // icon stuff
        var iconEl = document.createElement('img');
        var iconSrc = 'http://openweathermap.org/img/wn/' + iconCode + '@2x.png'
        iconEl.setAttribute('id', 'wicon')
        iconEl.setAttribute('src', iconSrc)
        iconEl.setAttribute('alt', 'weather icon')

        olEl.setAttribute("style", "list-style-type:none")

        h3El.textContent = day
        tempEl.textContent = 'Temp ' + tempF + ' ' + degSym + 'F';
        humidityEl.textContent = 'Humidity ' + humidity + '%';
        windEl.textContent = 'Windspeed ' + windSpeed + ' mps';


        divMainEl.appendChild(divEl);
        divEl.appendChild(h3El);
        divEl.appendChild(iconEl);
        divEl.appendChild(olEl);
        olEl.appendChild(tempEl);
        olEl.appendChild(humidityEl);
        olEl.appendChild(windEl);

    }

}



searchButtonEl.addEventListener('click', formSubmitHandler);
searchInputEl.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault()
        searchButtonEl.click();
    }
});
cityBtnEl.addEventListener('click', buttonClickHandler);