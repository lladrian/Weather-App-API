import express from 'express';
import axios from 'axios';
import { createClient } from 'redis';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';



dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    keyGenerator: (req, res) => {
        // Get the IP address
        const ip = req.headers['x-forwarded-for'] || req.ip;
        return ip;
    }
});

// Create a Redis client
const redisClient = createClient({
    url: 'redis://localhost:6379'
});

redisClient.connect().catch(console.error);

app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', true);


app.get('/weather/:location', async (req, res) => {
    try {
        const location = req.params.location;
        const ip = req.headers['x-forwarded-for'] || req.ip;
        const cachedData = await redisClient.get(location);
        
        if (cachedData) {
           // console.log("CACHE");
            return res.status(200).json({ data: JSON.parse(cachedData) });
        }

        const weather = await fetchData(location);
        const { latitude, longitude, resolvedAddress, timezone, currentConditions } = weather;
        const degreeCelsius = ((currentConditions.temp - 32) * 5 / 9).toFixed(0);

        let output = "\nLatitude   Longitude  Location                                                      Timezone         Temperature\n";
        output += `${latitude.toString().padEnd(10)} ${longitude.toString().padEnd(10)} ${resolvedAddress.toString().padEnd(60)}  ${timezone}      ${degreeCelsius}°\n`;

        console.log(output);
        //console.log(`Client IP: ${ip}`);

        // Cache for 100 seconds
        await redisClient.set(location, JSON.stringify(weather), { EX: 100 });
       // console.log("PUT CACHE");

        return res.status(200).json({ data: weather });
    } catch (err) {
        console.error("Error fetching weather data or Redis failure:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


async function fetchData(location) {
   // const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}/2025-05-10/2025-05-10?key=API_KEY`);
    const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?key=API_KEY`);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Location not found');
        }
        throw new Error('Failed to fetch data from the weather API');
    }
    return response.json(response);
}



// Start the server
app.listen(port, () => {
    console.log(`Weather API is running on http://localhost:${port}`);
});

