const apiKey = ''; //removed for the sake of keeping personal data safe
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

document.getElementById('getWeatherBtn').addEventListener('click', function() {
    const city = document.getElementById('cityName').value;
    fetchWeather(city);
});

function fetchWeather(city) {
    const url = `${baseUrl}?q=${city}&appid=${apiKey}&units=metric`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error("There was an error fetching the weather data.", error);
        });
}

function displayWeather(data) {
    const weatherDiv = document.getElementById('weatherDisplay');
    if (data.main) {
        weatherDiv.innerHTML = `
            <h2>${data.name}</h2>
            <p>${data.weather[0].description}</p>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Humidity: ${data.main.humidity}%</p>
        `;
    } else {
        weatherDiv.innerHTML = `<p>Error fetching weather for ${city}.</p>`;
    }
}
