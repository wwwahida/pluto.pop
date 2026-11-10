require('dotenv').config()
const request = require('supertest')
const app = require('../../app')
const db = require('../../api/database/connect')
const securityQuestions = require('../../api/utils/securityQuestions')

afterAll(async () => {
  await db.end()
})

describe('GET /users', () => {
  it('returns 200 and an array', async () => {
    const res = await request(app).get('/users')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})

describe('GET /users/security-questions', () => {
  test.failing('returns the security questions', async () => {
    const res = await request(app).get('/users/security-questions')
    expect(res.body).toEqual(securityQuestions)
  })
})

describe('POST /users', () => {
  it('returns 400 when fields are missing', async () => {
    const res = await request(app).post('/users').send({ email: 'a@b.com' })
    expect(res.statusCode).toBe(400)
  })

  it('returns 400 for an invalid role', async () => {
    const res = await request(app).post('/users').send({
      email: 'x@example.com',
      password: 'pw',
      security_question: securityQuestions[0],
      security_answer: 'answer',
      role: 'admin'
    })
    expect(res.statusCode).toBe(400)
  })
})