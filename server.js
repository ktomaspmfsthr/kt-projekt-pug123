const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

const apiKey = 'fdcf1a8ae54f96afe6bc4cf5902127db';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');

app.get('/', function (req, res) {
  res.render('index', {weather: null, sunrise: null, sunset: null, error: null});
})

app.post('/result', function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  request(url, function (err, response, body) {
    if(err){
      res.render('result', {weather: null, error: 'Greška, pokušajte ponovno'});
    } else {
      let weather = JSON.parse(body);

      if(weather.main == undefined){
        res.render('result', {weather: null, error: 'Greška, pokušajte ponovno'});
      } else {
        let sunrise = format_time(weather.sys.sunrise);
        let sunset = format_time(weather.sys.sunset);
        let weatherText = `Temperatura je ${Math.round(weather.main.temp)} stupnjeva u ${city}!`;
        let sunriseText = `Sunce izlazi u ${sunrise}`;
        let sunsetText = `Sunce zalazi u ${sunset}`;
        
        res.render('result', {weather: weatherText, sunrise: sunriseText, sunset: sunsetText, error: null});
      }
    }
  });
})

function format_time(s) {
  const dtFormat = new Intl.DateTimeFormat('en-GB', {
    timeStyle: 'medium',
    timeZone: 'CET'
  });
  
  return dtFormat.format(new Date(s * 1e3));
}

app.listen(3000, function () {
  console.log('Slušanje na portu 3000!')
})
