// Pobierz elementy z HTML
const inputText = document.getElementById('inputText');
const searchButton = document.getElementById('SearchButton');
const outputSection = document.querySelector('.output-section');

// Funkcja do pobierania prognozy pogody
async function getWeatherForecast(city) {
  const apiKey = '{YOUR_API_KEY}'; // Zastąp swoim kluczem API
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=pl&appid=36969790414006408f983d11348bdb55`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Błąd API: ${response.status} - Sprawdź klucz API lub miasto.`);
    }
    const data = await response.json();
    displayForecast(data);
  } catch (error) {
    outputSection.innerHTML = `<p>Błąd: ${error.message}</p>`;
  }
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


searchButton.addEventListener('click', () => {
  const city = inputText.value.trim();
  if (city) {
    getWeatherForecast(city);
  } else {
    outputSection.innerHTML = '<p>Wprowadź nazwę miasta.</p>';
  }
});
