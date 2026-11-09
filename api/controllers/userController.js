const User = require('../model/User')
const bcrypt = require('bcrypt')
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

async function createUser(req, res) {
    try {
        const { email, password, security_question, security_answer, role, organisation, class_name, name, teacher_id } = req.body

        if (!email || !password || !security_question || !security_answer) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        if (role == 'teacher') {
            if (!organisation || !class_name) {
                return res.status(400).json({ error: 'Missing required fields for teacher' })
            }
        } else if (role == 'student') {
            if (!name || !teacher_id) {
                return res.status(400).json({ error: 'Missing required fields for student' })
            }
        } else {
            return res.status(400).json({ error: 'Invalid role' })
        }
        
        if (!securityQuestions.includes(security_question)) {
            return res.status(400).json({ error: 'Invalid security question' })
        }

        const password_hash = await bcrypt.hash(password, 10)
        const security_answer_hash = await bcrypt.hash(security_answer.trim().toLowerCase(), 10)

        const newUser = await User.create({ email, password_hash, security_question, security_answer_hash, role, organisation, class_name, name, teacher_id })
        res.status(201).json({ message: 'User created successfully', user_id: newUser.user_id, email: newUser.email, role: newUser.role })
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
    createUser,
    destroy,
    getSecurityQuestions
}