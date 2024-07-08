const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to render the form
app.get("/", (req, res) => {
  res.render("index");
});

// Route to handle form submission and get weather data
app.get("/weather", async (req, res) => {
  const { city } = req.body;
  try {
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=23.03&units=metric&lon=72.5081&appid=6db7852bc3356870fcc7e4a0acec2839 `,
      {
        params: {
          q: city,
          appid: process.env.WEATHER_API_KEY,
          units: "metric",
        },
      }
    );

    const weather = weatherResponse.data;
    res.render("weather", { weather,city  });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).send("Error fetching weather data");
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
