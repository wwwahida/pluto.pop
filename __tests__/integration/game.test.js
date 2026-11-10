require('dotenv').config()
const request = require('supertest')
const app = require('../../app')
const db = require('../../api/database/connect')

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
  test.failing('returns 404 for a missing question', async () => {
    const res = await request(app).delete('/game/999999')
    expect(res.statusCode).toBe(404)
  })
})

describe('PUT /game/:id', () => {
  test.failing('returns 404 for a missing question', async () => {
    const res = await request(app).put('/game/999999').send({ question: 'x' })
    expect(res.statusCode).toBe(404)
  })
})