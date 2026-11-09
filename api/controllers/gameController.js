const Question = require('../model/GameModels')

async function index(req, res) {
    try {
        const questions = await Question.getAll()
        res.status(200).json(questions)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
async function show(req, res) {
    try {
        const question = await Question.findByTopic(req.params.topic)
        if (question.length === 0) {
            return res.status(404).json({ error: `No questions found for topic ${req.params.topic}` })
        }
        res.status(200).json(question)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

async function create(req, res) {
    try {
        const newQuestion = await Question.create(req.body)
        res.status(201).json(newQuestion)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    index,
    show,
    create
}