const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('public'))

const userRouter = require('./api/routers/userRoutes');
const gameRouter = require('./api/routers/gameRoutes');

app.use('/users', userRouter);
app.use('/game', gameRouter);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'pluto.pop' });
})

module.exports = app;