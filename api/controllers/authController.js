const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const securityQuestions = require('../utils/securityQuestions')

async function register(req, res) {
    try {
        const { email, password, security_question, security_answer, role, organisation, class_name, name, teacher_id } = req.body

        if (!email || !password || !security_question || !security_answer || !role) {
            return res.status(400).json({ error: 'Missing required fields' })
        }

        if (!securityQuestions.includes(security_question)) {
            return res.status(400).json({ error: 'Invalid security question' })
        }

        if (role === 'teacher') {
            if (!organisation || !class_name) {
                return res.status(400).json({ error: 'Missing required fields for teacher' })
            }
        } else if (role === 'student') {
            if (!name || !teacher_id) {
                return res.status(400).json({ error: 'Missing required fields for student' })
            }
        } else {
            return res.status(400).json({ error: 'Invalid role' })
        }

        const existingUser = await User.findByEmail(email)
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' })
        }

        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));

        const password_hash = await bcrypt.hash(password, salt)
        const security_answer_hash = await bcrypt.hash(security_answer.trim().toLowerCase(), salt)

        const result = await User.create({
            email,
            password_hash,
            security_question,
            security_answer_hash,
            role,
            organisation: role === 'teacher' ? organisation : null,
            class_name: role === 'teacher' ? class_name : null,
            name: role === 'student' ? name : null,
            teacher_id: role === 'student' ? teacher_id : null
        })

        res.status(201).json({ message: 'User registered successfully', user_id: result.user_id, email: result.email, role: result.role })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Registration failed' })
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' })
        }

        const user = await User.findByEmail(email)

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }

        const validPassword = await bcrypt.compare(password, user.password_hash)

        if (validPassword) {
            const payload = { user_id: user.user_id, role: user.role }
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 })

            res.status(200).json({ message: 'Login successful', success: true, token, role: user.role })
        } else {
            res.status(401).json({ error: 'Invalid email or password' })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Login failed' })
    }
}
    
module.exports = {
    register,
    login
}