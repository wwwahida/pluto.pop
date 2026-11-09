const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('public'))
const router = require('./api/routers/gameRoutes');

app.get('/', (req, res) => {
    res.status(200).json({ message: 'pluto.pop' });
})

app.use('/game', router);

module.exports = app;