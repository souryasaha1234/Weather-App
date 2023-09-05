const container = document.querySelector('.container');

getTime = function (timestamp) {
    let unix_timestamp = +timestamp;
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    let date = new Date(unix_timestamp * 1000);
    // Hours part from the timestamp
    let hours = date.getHours();
    // Minutes part from the timestamp
    let minutes = date.getMinutes();
    // Seconds part from the timestamp
    let seconds = date.getSeconds();

    // Will display time in 10:30:23 format
    let formattedTime =
        hours.toString().padStart(2, '0') +
        ':' +
        minutes.toString().padStart(2, '0') +
        ':' +
        seconds.toString().padStart(2, '0');
    //console.log(formattedTime);
    return formattedTime;
};

// getTime(1549312452);

window.addEventListener('load', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            //console.log(position);
            lon = position.coords.longitude;
            lat = position.coords.latitude;

            //api id
            const API_key = '3b3ac5176dc74ad695ab78d1201f5e96';
            //exclude parts
            const exclude_parts = 'minutely,hourly,daily,alerts';
            const units = 'metric';
            //api URL
            API_URL =
                'https://api.openweathermap.org/data/3.0/onecall?' +
                // `lat=${lat}&lon=${lon}&exclude=${exclude_parts}&appid=${API_key}`;
                `lat=${lat}&lon=${lon}&exclude=${exclude_parts}&appid=${API_key}&units=${units}`;

            const date = new Date();

            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();

            // This arrangement can be altered based on how we want the date's format to appear.
            let currentDate = `${day}/${month}/${year}`;

            //give API
            this.fetch(API_URL)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    container.innerHTML = '';
                    let html = `
                      <h2><i class="bi bi-geo-alt-fill"></i> ${
                          data.timezone
                      }</h2>
                      <h1><i class="bi bi-thermometer-half"></i> ${
                          data.current.temp
                      }&degC</h1>
                      
                      <div class="outer">

                        <div class="row">
                          <div class="data_elements sun">
                            <h1><i class="bi bi-brightness-alt-high-fill"></i></h1>
                            <p><b><i class="bi bi-sunrise"></i> <u>Sunrise</u></b> : ${getTime(
                                data.current.sunrise
                            )}</p>
                          <p><b><i class="bi bi-sunset"></i> <u>Sunset</u></b> : ${getTime(
                              data.current.sunset
                          )}</p>
                          </div>
                          
                          <div class="data_elements">
                            <p><b><i class="bi bi-calendar-event"></i> <u>Date</u></b> : ${currentDate}</p>
                            <p><b><i class="bi bi-clock"></i> <u>Current time</u></b> : ${getTime(
                                data.current.dt
                            )}</p>
                          </div>
                        </div>

                        <div class="data_elements">
                          <p><b><i class="bi bi-thermometer-high"></i> <u>feels like</u></b> : ${
                              data.current.feels_like
                          }&degC</p>
                          <p><b><i class="bi bi-thermometer-half"></i> <u>pressurem</u></b> : ${
                              data.current.pressure
                          }mbar</p>
                          <p><b><i class="bi bi-droplet"></i> <u>humidity</u></b> : ${
                              data.current.humidity
                          }%</p>
                          <p><b><i class="bi bi-brightness-high"></i> <u>UV iindex</u></b> : ${
                              data.current.uvi
                          }</p>
                          <p><b><i class="bi bi-clouds"></i> <u>clouds</u></b> : ${
                              data.current.clouds
                          }%</p>
                          <p><b><i class="bi bi-eye-slash"></i> <u>visibility</u></b> : ${
                              data.current.visibility
                          }</p>
                          <p><b><i class="bi bi-wind"></i> <u>wind speed</u></b> : ${
                              data.current.wind_speed
                          }</p>
                        </div>
                      </div>
                    `;
                    container.innerHTML = html;
                });
        });
    }
});
