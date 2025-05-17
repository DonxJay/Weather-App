const apiKey = ''; // Api Key Here
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('cityName');
const weatherDisplay = document.getElementById('weatherDisplay');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const card = document.querySelector('.card');

const weatherCache = {}; // cache for previous results

// Detect enter key
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeatherBtn.click();
    }
});

// Button click
getWeatherBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city !== '') {
        if (weatherCache[city.toLowerCase()]) {
            displayWeather(weatherCache[city.toLowerCase()]);
        } else {
            fetchWeather(city);
        }
    }
});

// Fetch weather
function fetchWeather(city) {
    weatherDisplay.innerHTML = `<p class="loading">Loading...</p>`;
    const url = `${baseUrl}?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error('City not found');
            return res.json();
        })
        .then(data => {
            weatherCache[city.toLowerCase()] = data;
            displayWeather(data);
        })
        .catch(err => {
            weatherDisplay.innerHTML = `<p class="error">Error: ${err.message}</p>`;
        });
}

// Display weather
function displayWeather(data) {
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    const mainWeather = data.weather[0].main.toLowerCase();

    setBackground(mainWeather);

    weatherDisplay.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <img src="${iconUrl}" alt="Weather Icon" />
        <p><strong>${data.weather[0].main}</strong> - ${data.weather[0].description}</p>
        <p>🌡️ Temperature: ${data.main.temp}°C</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>🌬️ Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

// Set background based on weather
function setBackground(weather) {
    let background;
    if (weather.includes('cloud')) background = 'var(--cloudy)';
    else if (weather.includes('rain')) background = 'var(--rainy)';
    else if (weather.includes('snow')) background = 'var(--snowy)';
    else if (weather.includes('clear')) background = 'var(--sunny)';
    else background = 'var(--default-bg)';
    body.style.background = background;
}

// Toggle dark mode
darkModeToggle.addEventListener('change', () => {
    body.classList.toggle('dark-mode');
    card.classList.toggle('dark-mode');
});

// Auto-detect location
window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            const url = `${baseUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
            weatherDisplay.innerHTML = `<p class="loading">Loading local weather...</p>`;

            fetch(url)
                .then(res => res.json())
                .then(data => displayWeather(data))
                .catch(() => {
                    weatherDisplay.innerHTML = `<p class="error">Could not fetch local weather.</p>`;
                });
        });
    }
});
