const db = require('../database/connect');

class Question {
    constructor({ topic, question, answer, alt_answers, fun_fact, image_url }) {
        this.topic = topic
        this.question = question
        this.answer = answer
        this.alt_answers = alt_answers
        this.fun_fact = fun_fact
        this.image_url = image_url
    }

    static async getAll() {
        const response = await db.query('SELECT * FROM questions;')
        return response.rows.map(row => new Question(row))
    }

    static async findByTopic(topic) {
        const response = await db.query('SELECT * FROM questions WHERE topic = $1;', [topic])
        return response.rows.map(row => new Question(row))
    }
    
    static async create(data) {
        const { topic, question_type, question, answer, alt_answers, fun_fact, image_url } = data  
        const response = await db.query(
            'INSERT INTO questions (topic, question_type, question, answer, alt_answers, fun_fact, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;',
            [topic, question_type, question, answer, alt_answers, fun_fact, image_url]
        )
        return new Question(response.rows[0])
    }
}

module.exports = Question