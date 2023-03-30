// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
// Access Key: a62c7d10877c661b208fffa0f58b2658

// var apiUrl = 'http://api.openweathermap.org/'

// current and future conditions for that city and that city is added to the search history
console.log(document.location.search)

var searchInputEl = document.querySelector('.search-bar')
var searchButtonEl = document.querySelector('.search-button')
var listParentEl = document.querySelector('.list-parent')

if ((localStorage.getItem('cityListStored') === null)) {
    var cityList = [];
} else {
    var cityList = window.localStorage.getItem('cityListStored');
    cityList = cityList.split(',')
    console.log(cityList)
    console.log(typeof cityList)
    createCityListButtons()
}

function createCityListButtons() {
    for (i = 0; i < cityList.length; i++) {
        var btnEl = document.createElement('button');
        btnEl.textContent = cityList[i];
        btnEl.classList.add('button');
        listParentEl.appendChild(btnEl);

    }
}

function addCityToList(cityName) {
    var btnEl = document.createElement('button');
    btnEl.textContent = cityName;
    btnEl.classList.add('button');
    listParentEl.appendChild(btnEl);


}

var formSubmitHandler = function (event) {

    event.preventDefault();
    var city = searchInputEl.value

    if (city) {
        getCityLatLon(city);
        saveCity(city);
    } else {
        console.log('enter city')
    }

};



var getCityLatLon = function (cityName) {

    var apiZip = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&appid=a62c7d10877c661b208fffa0f58b2658';

    fetch(apiZip)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    var lat = data[0].lat
                    var lon = data[0].lon
                    var cityName = data[0].name

                    getWeather(lat, lon)
                    addCityToList(cityName)
                });
            } else {
                console.log('dne');
            }

        })
}


var getWeather = function (lat, lon) {

    var apiLatLon = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=a62c7d10877c661b208fffa0f58b2658'
    console.log(apiLatLon)

    fetch(apiLatLon)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    displayDailyWeather(data);

                });
            } else {
                console.log('dne');
            }

        })
}

var saveCity = function (cityName) {
    console.log(cityName)
    cityList.push(cityName)

    window.localStorage.setItem('cityNameStored', cityName)
    window.localStorage.setItem('cityListStored', cityList)

}

// city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the the wind speed
var displayDailyWeather = function (data) {
    console.log(data)
    var cityName = data.city.name
    var unixDay = data.list[0].dt
    var day = dayjs.unix(unixDay).format('MM-DD-YY');
    var icon = data.list[0].weather[0].icon
    var weather = data.list[0].main
    var tempK = weather.temp
    var tempF = Math.round(((tempK-273.15)*(9/5))+32);
    var humidity = weather.humidity;
    var windSpeed = Math.round((data.list[0].wind.speed)/60)

    console.log(cityName)
    console.log(day)
    console.log(icon)
    console.log(tempF)
    console.log(humidity)
    console.log(windSpeed)

    var dailyDivEl = document.querySelector('.daily')

    var cityNameEl = createElement('h2'); 
    var dateEl = createElement('h3'); 
    var iconEl = createElement('span'); 
    var olEl = createElement('ol')
    var tempEl = createElement('li'); 
    var humidityEl = createElement('li'); 
    var windEl = createElement('li')
    
    iconEl.classList.add('icon');
    var iEl = createElement('i');
    iEl.classList.add('fas fa-'+icon);

    dailyDivEl.appendChild(cityNameEl);
    dailyDivEl.appendChild(dateEl);
    dailyDivEl.appendChild(iconEl);
    dailyDivEl.appendChild(olEl);
    olEl.appendChild(tempEl);
    olEl.appendChild(humidityEl);
    olEl.appendChild(windEl);

}

searchButtonEl.addEventListener('click', formSubmitHandler);