const userController = require('../../../api/controllers/userController')
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

describe('getSecurityQuestions', () => {
  it('returns the list with 200', () => {
    const res = mockRes()
    userController.getSecurityQuestions({}, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(securityQuestions)
  })
})

describe('getByRole', () => {
  it('returns 200 and users for the role', async () => {
    const teachers = [{ user_id: 1, role: 'teacher' }]
    User.getByRole.mockResolvedValue(teachers)
    const res = mockRes()

    await userController.getByRole({ params: { role: 'teacher' } }, res)

    expect(User.getByRole).toHaveBeenCalledWith('teacher')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(teachers)
  })

  it('returns 500 if the model throws', async () => {
    User.getByRole.mockRejectedValue(new Error('db down'))
    const res = mockRes()

    await userController.getByRole({ params: { role: 'teacher' } }, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'db down' })
  })
})

describe('destroy', () => {
  it('returns 200 and the result', async () => {
    User.delete.mockResolvedValue({ message: 'deleted' })
    const res = mockRes()

    await userController.destroy({ params: { id: '3' } }, res)

    expect(User.delete).toHaveBeenCalledWith('3')
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'deleted' })
  })

  it('returns 500 if the model throws', async () => {
    User.delete.mockRejectedValue(new Error('nope'))
    const res = mockRes()

    await userController.destroy({ params: { id: '3' } }, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'nope' })
  })
})