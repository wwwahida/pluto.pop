const db = require('../database/connect');

class Game {
    constructor({ id, question, answer, marks }) {
        this.id = id
        this.question = question
        this.answer = answer
        this.marks = marks
    }

static async getAll() {
        const response = await db.query('SELECT * FROM game;')
        return response.rows.map(row => new Game(row))
    }
}

module.exports = Game