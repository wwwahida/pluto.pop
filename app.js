const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors({
    origin: process.env.FRONTEND_URL
}))

app.use(express.json())
app.use(express.static('public'))

const userRouter = require('./api/routers/userRoutes');
const gameRouter = require('./api/routers/gameRoutes');
const authRouter = require('./api/routers/authRoutes');

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/game', gameRouter);

app.get('/', (req, res) => {
    res.status(200).json({ message: 'pluto.pop' });
})

module.exports = app;