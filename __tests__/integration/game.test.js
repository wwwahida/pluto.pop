require('dotenv').config()
const request = require('supertest')
const app = require('../../app')
const db = require('../../api/database/connect')
const jwt = require('jsonwebtoken')

afterAll(async () => {
  await db.end()
})

describe('GET /game', () => {
  it('returns 200 and an array', async () => {
    const res = await request(app).get('/game')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

describe('GET /game/:topic', () => {
  it('returns 404 for an unknown topic', async () => {
    const res = await request(app).get('/game/no-such-topic')
    expect(res.statusCode).toBe(404)
  })
})

describe('DELETE /game/:id', () => {
  it('returns 404 for a missing question', async () => {
    const token = jwt.sign({ user_id: 1, role: 'teacher' }, process.env.JWT_SECRET, { expiresIn: 3600 })

    const res = await request(app).delete('/game/999999').set('Authorization', token)
    expect(res.statusCode).toBe(404)
  })

  it('returns 401 without authentication', async () => {
    const res = await request(app).delete('/game/999999')

    expect(res.statusCode).toBe(401)
  })
})

describe('PUT /game/:id', () => {
  it('returns 404 for a missing question', async () => {
    const token = jwt.sign({ user_id: 1, role: 'teacher' }, process.env.JWT_SECRET, { expiresIn: 3600 })

    const res = await request(app).put('/game/999999').set('Authorization', token).send({ question: 'x' })
    expect(res.statusCode).toBe(404)
  })
})

describe('POST /game', () => {
    it('creates a question and returns 201', async () => {
      const text = `integration-test-${Date.now()}`
      
      const token = jwt.sign({ user_id: 1, role: 'teacher' }, process.env.JWT_SECRET, { expiresIn: 3600 })
  
      const res = await request(app).post('/game').set('Authorization', token).send({
          topic: 'integration-test',
          question_type: 'place',
          question: text,
          answer: 'a',
          alt_answers: [],
          fun_fact: 'f',
          image_url: null
      })
      expect(res.statusCode).toBe(201)
      expect(res.body.question).toBe(text)

      await db.query('DELETE FROM questions WHERE question = $1', [text])
    }) 
})