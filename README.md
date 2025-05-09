# API Weather
A simple weather API that fetches and returns weather data from a 3rd party API.

## Features

- Start by creating a simple API that returns a hardcoded weather response.
- Use environment variables to store the API key and the Redis connection string.
- Make sure to handle errors properly. If the 3rd party API is down, or if the city code is invalid, make sure to return the appropriate error message.
- Use some package or module to make HTTP requests e.g. if you are using Node.js, you can use the axios package, if you are using Python, you can use the requests module.
- Implement rate limiting to prevent abuse of your API. You can use a package like express-rate-limit if you are using Node.js or flask-limiter if you are using Python.

## What I installed to this app

1. npm install express axios redis express-rate-limit dotenv

## Installation

1. Make sure you have [Node.js](https://nodejs.org) installed.

2. Clone or download this project.

3. First you need to install using **`npm i`** in terminal.

4. To run use this command : `node api_weather_app.js`
    - Usage:  `http://localhost:4000/weather/<location>`
      - Search via Web:
          - **`http://localhost:4000/weather/San Jose, Ormoc City`**  fetches and returns weather data from a 3rd party API.

5. https://roadmap.sh/projects/weather-api-wrapper-service
