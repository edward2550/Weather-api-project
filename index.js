'use strict';
const apiKey = 'ad6e4dcf5a782ef89b605f3466d9d0ff';

const searchUrl = 'https://api.openweathermap.org/data/2.5/weather';

function formatQuereyParams(params) {
  const quereyItem = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );

  return quereyItem;
}

function displayWeather(responseJson) {
  $('.js-results').empty();
  //trying to calculate kelvin into fa
  var temp = Math.floor((responseJson.main.temp - 273.15) * 1.8 + 32);
  if (responseJson.weather.length == 0) {
    $('.js-results').append(
      `<li>This city does not have a current weather</li>`
    );
  } else {
    $('.js-results').append(`
            <h2>${responseJson.name}</h2>
            <li> Current weather: ${responseJson.weather[0].description} </li>
            <li> Temperature: ${temp + '&#8457;'}</li>
            <li> Humidity: ${responseJson.main.humidity} </li>
            <li> Wind speed: ${responseJson.wind.speed + 'm/s'} </li>
        `);
  }
  $('.js-results').removeClass('hidden');
}

function getWeather(querey) {
  const params = {
    q: querey,
  };
  const quereyString = formatQuereyParams(params);
  const url = searchUrl + '?' + quereyString + '&appid=' + apiKey;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      displayWeather(responseJson);
    })
    .catch(err => {
      $('.error-message').text(`Something went wrong: ${err.message}`);
    });
}

//this function will watch the form for an event
function watchForm() {
  $('#js-form').submit(event => {
    //override default behavior
    event.preventDefault();
    //grab the value of the input
    const searchTerm = $('#js-location').val();
    //use the data in the function
    getWeather(searchTerm);
  });
}

$(watchForm);
