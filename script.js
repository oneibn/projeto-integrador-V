const apiKey = 'dd033092e07f8c61ed05714e6c354ec0';
var city = "Sorocaba";
var myChart;

  function getWeatherData(cidade) {
        city = cidade;
        var currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
        var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

        Promise.all([fetch(currentUrl), fetch(forecastUrl)])
            .then(responses => Promise.all(responses.map(response => response.json())))
            .then(data => {
                const currentWeather = data[0];
                const forecastData = data[1];
                
                displayCurrentWeather(currentWeather);
                displayForecastChart(forecastData);
            })
            .catch(error => console.error('Erro ao obter dados climáticos:', error));
    }

    function displayCurrentWeather(data) {
        var weatherDataElement = document.getElementById('weatherData');
        weatherDataElement.innerHTML = `
            <h2>${data.name}</h2>
            <p>${data.weather[0].description}</p>
            <p>Temperatura: ${data.main.temp}°C</p>
            <p>Umidade: ${data.main.humidity}%</p>
        `;
    }

    function displayForecastChart(data) {
        var forecastChartElement = document.getElementById('forecastChart');

        var labels = data.list.map(item => item.dt_txt);
        var temperatures = data.list.map(item => item.main.temp);

        var ctx = forecastChartElement.getContext('2d');
        
        let chartStatus = Chart.getChart("forecastChart");
        if (chartStatus != undefined)
        {
            chartStatus.destroy();
        }

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Temperatura (°C)',
                    data: temperatures,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'hour'
                        }
                    }
                }
            }
        });
    }

    function searchWeather() {
        city = document.getElementById('cityInput').value;
        getWeatherData(city);
    }

    getWeatherData(city);
