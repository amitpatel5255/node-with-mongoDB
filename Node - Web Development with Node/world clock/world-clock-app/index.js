const express = require('express');
const moment = require('moment-timezone');
require('dotenv').config();

const app = express();

// Set up views and view engine (optional if you want to render views)
app.set('view engine', 'pug');
app.set('views', './views');

// Define routes
app.get('/', (req, res) => {
    res.render('index'); // You'll create this view (index.ejs) to display the world clock
});


// Route to display the time for a specific city
app.get('/time/:continent/:city', (req, res) => {
    const { continent, city } = req.params;
    const timezone = `${continent}/${city}`;
    try {
      const time = moment().tz(timezone).format('MMMM Do YYYY, h:mm:ss a');
      const cityName = city.replace('_', ' ');
      res.render('clock', { city: cityName, time });
    } catch (error) {
      res.status(404).send('Timezone not found');
    }
  });
  

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
