const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const OPENWEATHER_API_KEY = '6f5622591ff7ebb962a12e2f9fc9d70c';

app.use(cors());
app.use(express.static(path.join(__dirname))); // Static files

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/weather', async (req, res) => {
    const city = req.query.city;
    if (!city) {
        return res.status(400).json({ error: 'Parameter city wajib diisi, contoh: ?city=Surabaya' });
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=id`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({
            error: 'Gagal mengambil data cuaca',
            detail: err.response?.data || err.message
        });
    }
});

const kecamatanList = [
    { name: 'Tegalsari', lat: -7.2744, lon: 112.7379 },
    { name: 'Sukolilo', lat: -7.2830, lon: 112.7910 },
    { name: 'Rungkut', lat: -7.3265, lon: 112.7522 },
    { name: 'Sambikerep', lat: -7.2557, lon: 112.6603 },
    { name: 'Wonokromo', lat: -7.3024, lon: 112.7367 }
];

app.get('/weather/surabaya', async (req, res) => {
    const results = [];

    for (const kec of kecamatanList) {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${kec.lat}&lon=${kec.lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=id`;
            const response = await axios.get(url);
            results.push({
                kecamatan: kec.name,
                suhu: response.data.main.temp,
                cuaca: response.data.weather[0].description,
                kelembapan: response.data.main.humidity,
                kecepatanAngin: response.data.wind.speed
            });
        } catch (err) {
            results.push({
                kecamatan: kec.name,
                error: 'Gagal mengambil data',
                detail: err.response?.data || err.message
            });
        }
    }

    res.json(results);
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
