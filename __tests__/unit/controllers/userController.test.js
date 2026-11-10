const userController = require('../../../api/controllers/userController')
const User = require('../../../api/model/User')
const bcrypt = require('bcrypt')
const securityQuestions = require('../../../api/utils/securityQuestions')

jest.mock('../../../api/model/User')
jest.mock('bcrypt')

// fake Express response: status() returns res so .status(200).json(...) chains
const mockRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

afterEach(() => jest.clearAllMocks())

describe('index', () => {
  it('returns 200 and all users', async () => {
    const users = [{ user_id: 1 }, { user_id: 2 }]
    User.getAll.mockResolvedValue(users)
    const res = mockRes()

    await userController.index({}, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(users)
  })

  it('returns 500 if the model throws', async () => {
    User.getAll.mockRejectedValue(new Error('db down'))
    const res = mockRes()

    await userController.index({}, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'db down' })
  })
})

describe('createUser', () => {
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
    await userController.createUser({ body: { email: 'a@b.com' } }, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' })
  })

  it('returns 400 for an invalid role', async () => {
    const res = mockRes()
    await userController.createUser({ body: { ...validTeacher, role: 'admin' } }, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid role' })
  })

  it('returns 400 if a teacher is missing organisation', async () => {
    const res = mockRes()
    await userController.createUser(
      { body: { ...validTeacher, organisation: undefined } }, res
    )

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields for teacher' })
  })

  it('creates a teacher and returns 201', async () => {
    bcrypt.hash.mockResolvedValue('hashed')
    User.create.mockResolvedValue({ user_id: 7, email: 'a@b.com', role: 'teacher' })
    const res = mockRes()

    await userController.createUser({ body: validTeacher }, res)

    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
      message: 'User created successfully',
      user_id: 7,
      email: 'a@b.com',
      role: 'teacher'
    })
  })
})

describe('getSecurityQuestions', () => {
  it('returns the list with 200', () => {
    const res = mockRes()
    userController.getSecurityQuestions({}, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(securityQuestions)
  })
})