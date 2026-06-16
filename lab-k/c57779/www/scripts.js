const inputText = document.getElementById('inputText');
const searchButton = document.getElementById('SearchButton');
const outputSection = document.querySelector('.output-section');

function getCurrentWeather(city) {
  return new Promise((resolve) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pl&appid=36969790414006408f983d11348bdb55`;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve(data);
      } else {
        console.error(`Błąd API (XHR): ${xhr.status}`);
        resolve(null);
      }
    };
    xhr.onerror = function() {
      console.error("Błąd sieci przy pobieraniu aktualnej pogody");
      resolve(null);
    };
    xhr.send();
  });
}

async function getForecastWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=pl&appid=36969790414006408f983d11348bdb55`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Błąd API: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Błąd przy pobieraniu prognozy:", error);
    return null;
  }
}

function displayCurrentWeather(data) {
  const temp = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const icon = data.weather[0].icon;
  const cityName = data.name;
  const currentDiv = document.createElement('div');
  currentDiv.className = 'forecast-item';
  currentDiv.innerHTML = `
    <strong>Aktualna pogoda</strong><br>
    ${cityName}<br>
    <div style="display: flex; align-items: center;">
      <div>${temp}°C<br>${description}</div>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" style="width: 50px; height: 50px; margin-right: 10px;">
    </div>
  `;
  outputSection.appendChild(currentDiv);
}

function displayForecast(data) {
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString('pl-PL');
    const time = new Date(item.dt * 1000).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });
    const temp = Math.round(item.main.temp);
    const description = item.weather[0].description;
    const icon = item.weather[0].icon;
    const forecastDiv = document.createElement('div');
    forecastDiv.className = 'forecast-item';
    forecastDiv.innerHTML = `
      <strong>${date}</strong><br>
      ${time}<br>
      <div style="display: flex; align-items: center;">
        <div>${temp}°C<br>${description}</div>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" style="width: 50px; height: 50px; margin-right: 10px;">
      </div>
    `;
    outputSection.appendChild(forecastDiv);
  });
}

searchButton.addEventListener('click', async () => {
  const city = inputText.value.trim();
  if (city) {
    outputSection.innerHTML = '';
    const currentData = await getCurrentWeather(city);
    const forecastData = await getForecastWeather(city);
    console.log("Odpowiedź żądania CURRENT", currentData);
    console.log("Odpowiedź żądania FORECAST", forecastData);
    if (currentData) {
      displayCurrentWeather(currentData);
    }
    if (forecastData) {
      displayForecast(forecastData);
    }
    if (!currentData && !forecastData) {
      outputSection.innerHTML = '<p>Błąd: Nie udało się pobrać danych pogodowych.</p>';
    }
  } else {
    outputSection.innerHTML = '<p>Wprowadź nazwę miasta.</p>';
  }
});
