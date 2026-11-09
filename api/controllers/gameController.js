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

async function destroy (req, res) {
    try {
        const id = req.params.id
        const question = await Question.delete(id)

        if (!question) {
            return res.status(404).json({ error: `Question with id ${id} not found` })
        }
        
        res.status(200).json({ message: `Question with id ${id} deleted successfully` })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

async function update(req, res) {
    try {
        const id = req.params.id
        const updatedQuestion = await Question.update(id, req.body)
            
        if (!updatedQuestion) {
            return res.status(404).json({ error: `Question with id ${id} not found` })
        }
        res.status(200).json(updatedQuestion)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


module.exports = {
    index,
    show,
    create,
    destroy,
    update
}