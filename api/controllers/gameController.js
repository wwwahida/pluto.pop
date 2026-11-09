const Game = require('../models/GameModels')

async function index(req, res) {
    try {
        const questions = await Game.getAll()
        res.status(200).json(questions)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    index,
}