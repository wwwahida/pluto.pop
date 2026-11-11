const authController = require('../../../api/controllers/authController')
const User = require('../../../api/model/User')
const bcrypt = require('bcrypt')
const securityQuestions = require('../../../api/utils/securityQuestions')

jest.mock('../../../api/model/User')
jest.mock('bcrypt')

const mockRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

afterEach(() => jest.clearAllMocks())

describe('register', () => {
  const validTeacher = {
    email: 'a@b.com',
    password: 'pw',
    security_question: securityQuestions[0],
    security_answer: 'Answer',
    role: 'teacher',
    organisation: 'School',
    class_name: '5A'
  }

  it('returns 400 if required fields are missing', async () => {
    const res = mockRes()
    await authController.register({ body: { email: 'a@b.com' } }, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' })
  })

  it('returns 400 for an invalid role', async () => {
    const res = mockRes()
    await authController.register({ body: { ...validTeacher, role: 'admin' } }, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid role' })
  })

  it('returns 400 if a teacher is missing organisation', async () => {
    const res = mockRes()
    await authController.register(
      { body: { ...validTeacher, organisation: undefined } }, res
    )

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields for teacher' })
  })

  it('creates a teacher and returns 201', async () => {
    bcrypt.hash.mockResolvedValue('hashed')
    User.create.mockResolvedValue({ user_id: 7, email: 'a@b.com', role: 'teacher' })
    const res = mockRes()

    await authController.register({ body: validTeacher }, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      message: 'User registered successfully',
      user_id: 7,
      email: 'a@b.com',
      role: 'teacher'
    })
  })
})

describe('register (remaining branches)', () => {
  const validStudent = {
    email: 's@b.com',
    password: 'pw',
    security_question: securityQuestions[0],
    security_answer: 'Answer',
    role: 'student',
    name: 'Sam',
    teacher_id: 1
  }

  it('returns 400 if a student is missing teacher_id', async () => {
    const res = mockRes()
    await authController.register(
      { body: { ...validStudent, teacher_id: undefined } }, res
    )

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields for student' })
  })

  it('returns 400 for an invalid security question', async () => {
    const res = mockRes()
    await authController.register(
      { body: { ...validStudent, security_question: 'Not a real question' } }, res
    )

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid security question' })
  })

  it('creates a student and returns 201', async () => {
    bcrypt.hash.mockResolvedValue('hashed')
    User.create.mockResolvedValue({ user_id: 9, email: 's@b.com', role: 'student' })
    const res = mockRes()

    await authController.register({ body: validStudent }, res)

    expect(res.status).toHaveBeenCalledWith(201)
  })

  it('returns 500 if User.create throws', async () => {
    bcrypt.hash.mockResolvedValue('hashed')
    User.create.mockRejectedValue(new Error('duplicate email'))
    const res = mockRes()

    await authController.register({ body: validStudent }, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Registration failed' })
  })
})