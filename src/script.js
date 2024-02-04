const container = document.querySelector('.container');
const cityAddr = document.querySelector('.cityAddr');

let getTime = function (timestamp) {
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

const getJSON = function (url, errorMsg = 'Something went wrong') {
    return fetch(url).then(response => {
        if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

        return response.json();
    });
};

let getCity = async function (lat, lon) {
    //api id
    const API_key = '483568d88d7d456cb38ab27765981362';
    //api URL
    API_URL = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${API_key}`;
    //give API
    try {
        const data = await Promise.all([getJSON(API_URL)]);
        console.log(data[0]);
        let roadAddr = data[0]?.results[0]?.road ?? '';
        return (
             roadAddr + ' ' + data[0].results[0].address_line2
        );
    } catch (err) {
        console.error(err);
    }
};
let getSetData = async function (lat, lon) {
    // console.log('Onload');
    // console.log(lat);
    // console.log(lon);
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
        .then(async data => {
            // console.log(data);
            container.innerHTML = '';
            const city = await getCity(lat, lon);
            console.log(city);
            let html = `
              <h2 class="cityAddr"><i class="bi bi-geo-alt-fill"></i> ${city} </h2>
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
    // setTimeout(() => {
    //     console.log('Delayed for 5 second.');
    //     // getCity(lat, lon);
    //     console.log(getCity(lat, lon));
    // }, '5000');
};

let citySetData = function () {
    //api id
    const API_key = '483568d88d7d456cb38ab27765981362';

    //get search text
    var textSearch = document.getElementById('textSearch').value;
    console.log(textSearch);
    //api URL
    API_URL = `https://api.geoapify.com/v1/geocode/search?text=${textSearch}&apiKey=${API_key}`;

    //give API
    this.fetch(API_URL)
        .then(response => {
            return response.json();
        })
        .then(data => {
            // console.log(data);
            let lon = data.features[0].geometry.coordinates[0];
            let lat = data.features[0].geometry.coordinates[1];
            // console.log(lat);
            // console.log(lon);
            getSetData(lat, lon);
        })
        .catch(error => console.log('error', error));
};

window.addEventListener('load', function () {
    var loadingScreen = document.getElementById('preloader');
    var content = document.getElementById('content');

    // Simulate a delay to demonstrate the loading effect
    setTimeout(function () {
        document.body.style.overflow = 'visible'; // scroll visible after loading
        loadingScreen.style.display = 'none';
        content.style.display = 'block';
        content.style.opacity = 1;
    }, 3000);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            //console.log(position);
            lon = position.coords.longitude;
            lat = position.coords.latitude;
            getSetData(lat, lon);
        });
    }
});
