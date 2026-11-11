const User = require('../../../api/model/User')
const db = require('../../../api/database/connect')

jest.mock('../../../api/database/connect', () => ({
  query: jest.fn(),
  connect: jest.fn()
}))

const userRow = { user_id: 1, email: 'a@b.com', role: 'teacher' }

afterEach(() => jest.resetAllMocks())

describe('User.getAll', () => {
  it('returns User instances', async () => {
    db.query.mockResolvedValueOnce({ rows: [userRow] })
    const users = await User.getAll()
    expect(users).toHaveLength(1)
    expect(users[0]).toBeInstanceOf(User)
  })
})

describe('User.getByRole', () => {
  it('returns users for the role', async () => {
    db.query.mockResolvedValueOnce({ rows: [userRow] })
    const users = await User.getByRole('teacher')
    expect(users[0].role).toBe('teacher')
  })
})

describe('User.create', () => {
  let client

  beforeEach(() => {
    client = { query: jest.fn(), release: jest.fn() }
    db.connect.mockResolvedValue(client)
  })

  it('creates a teacher and commits', async () => {
    client.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [{ user_id: 1, email: 'a@b.com', role: 'teacher' }] })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})

    const user = await User.create({
      email: 'a@b.com',
      password_hash: 'hash',
      security_question: 'q',
      security_answer_hash: 'ahash',
      role: 'teacher',
      organisation: 'School',
      class_name: '5A'
    })

    expect(user).toBeInstanceOf(User)
    expect(user.user_id).toBe(1)
    expect(client.query.mock.calls[3][0]).toBe('COMMIT')
    expect(client.release).toHaveBeenCalledTimes(1)
  })

  it('rolls back and throws if the insert fails', async () => {
    client.query
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(new Error('duplicate email'))
      .mockResolvedValueOnce({})

    await expect(User.create({ email: 'a@b.com', role: 'teacher' }))
      .rejects.toThrow('duplicate email')

    expect(client.query.mock.calls[2][0]).toBe('ROLLBACK')
    expect(client.release).toHaveBeenCalledTimes(1)
  })

  it('creates a student and commits', async () => {
  client.query
    .mockResolvedValueOnce({})
    .mockResolvedValueOnce({ rows: [{ user_id: 2, email: 's@b.com', role: 'student' }] })
    .mockResolvedValueOnce({})
    .mockResolvedValueOnce({})

  const user = await User.create({
    email: 's@b.com',
    password_hash: 'hash',
    security_question: 'q',
    security_answer_hash: 'ahash',
    role: 'student',
    name: 'Sam',
    teacher_id: 1
  })

  expect(user.role).toBe('student')
  expect(client.query.mock.calls[2][1]).toEqual([2, 'Sam', 1])
})

it('rolls back and throws for an invalid role', async () => {
  client.query
    .mockResolvedValueOnce({})
    .mockResolvedValueOnce({ rows: [{ user_id: 3, role: 'admin' }] })
    .mockResolvedValueOnce({})

  await expect(User.create({ email: 'x@b.com', role: 'admin' }))
    .rejects.toThrow('Invalid role')

  expect(client.query.mock.calls[2][0]).toBe('ROLLBACK')
})

})

describe('User.delete', () => {
  it('returns a message when a user is deleted', async () => {
    db.query.mockResolvedValueOnce({ rowCount: 1 })
    const result = await User.delete(5)
    expect(result.message).toBe('User with id 5 deleted successfully')
  })

  it('throws when no user was deleted', async () => {
    db.query.mockResolvedValueOnce({ rowCount: 0 })
    await expect(User.delete(5)).rejects.toThrow('User with id 5 not found')
  })
})
