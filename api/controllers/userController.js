const User = require('../model/User')
const securityQuestions = require('../utils/securityQuestions')

async function index(req, res) {
    try {
        const users = await User.getAll()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

async function getByRole(req, res) {
    try {
        const role = req.params.role
        const users = await User.getByRole(role)
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

function getSecurityQuestions(req, res) {
    res.status(200).json(securityQuestions)
}

async function destroy(req, res) {
    try {
        const id = req.params.id
        const result = await User.delete(id)
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

module.exports = {
    index,
    getByRole,
    destroy,
    getSecurityQuestions
}