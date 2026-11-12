const db = require('../database/connect');

class Question {
    constructor({ topic, question_type, question, answer, alt_answers, fun_fact, image_url }) {
        this.topic = topic
        this.question_type = question_type
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

    static async delete(id) {
        const response = await db.query('DELETE FROM questions WHERE id = $1;', [id])
        if (response.rowCount === 0) {
            return null
        }
        return { message: `Question with id ${id} deleted successfully` }
    }

    static async update(id, data) {
        const { topic, question_type, question, answer, alt_answers, fun_fact, image_url } = data
        const response = await db.query(
            `UPDATE questions SET 
                topic = COALESCE($1, topic),
                question_type = COALESCE($2, question_type),
                question = COALESCE($3, question),
                answer = COALESCE($4, answer),
                alt_answers = COALESCE($5, alt_answers),
                fun_fact = COALESCE($6, fun_fact),
                image_url = COALESCE($7, image_url)
            WHERE id = $8 RETURNING *; `,
            [topic, question_type, question, answer, alt_answers, fun_fact, image_url, id]
        )

        if (response.rowCount === 0) {
            return null
        }
        
        return new Question(response.rows[0], { message: `Question with id ${id} updated successfully` })
    }
}

module.exports = Question