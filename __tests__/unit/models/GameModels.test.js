const Question = require('../../../api/model/GameModels')
const db = require('../../../api/database/connect')

jest.mock('../../../api/database/connect', () => ({ query: jest.fn() }))

const row = {
  topic: 't1',
  question_type: 'qt1',
  question: 'q1',
  answer: 'a1',
  alt_answers: 'aa1',
  fun_fact: 'f1',
  image_url: 'i1'
}

afterEach(() => jest.clearAllMocks())

describe('Question.getAll', () => {
  it('returns Question instances for each row', async () => {
    db.query.mockResolvedValueOnce({ rows: [row] })

    const questions = await Question.getAll()

    expect(questions).toHaveLength(1)
    expect(questions[0]).toBeInstanceOf(Question)
    expect(questions[0]).toHaveProperty('topic', 't1')
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM questions;')
  })

  it('returns an empty array when there are no rows', async () => {
    db.query.mockResolvedValueOnce({ rows: [] })

    expect(await Question.getAll()).toEqual([])
  })

  it('rejects if the query fails', async () => {
    db.query.mockRejectedValueOnce(new Error('db down'))

    await expect(Question.getAll()).rejects.toThrow('db down')
  })
})

describe('Question.findByTopic', () => {
  it('queries with the topic and returns Question instances', async () => {
    db.query.mockResolvedValueOnce({ rows: [row] })

    const questions = await Question.findByTopic('t1')

    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM questions WHERE topic = $1;',
      ['t1']
    )
    expect(questions[0]).toBeInstanceOf(Question)
  })

  it('returns an empty array when nothing matches', async () => {
    db.query.mockResolvedValueOnce({ rows: [] })

    expect(await Question.findByTopic('nope')).toEqual([])
  })
})

describe('Question.create', () => {
  it('inserts the data and returns a Question', async () => {
    db.query.mockResolvedValueOnce({ rows: [row] })

    const created = await Question.create(row)

    expect(created).toBeInstanceOf(Question)
    expect(created.question).toBe('q1')
    expect(db.query.mock.calls[0][1]).toEqual([
      't1', 'qt1', 'q1', 'a1', 'aa1', 'f1', 'i1'
    ])
  })
})

describe('Question.delete', () => {
  it('returns a success message when a row is deleted', async () => {
    db.query.mockResolvedValueOnce({ rowCount: 1 })

    const result = await Question.delete(4)

    expect(db.query).toHaveBeenCalledWith(
      'DELETE FROM questions WHERE id = $1;',
      [4]
    )
    expect(result).toEqual({ message: 'Question with id 4 deleted successfully' })
  })

  it('throws when no row was deleted', async () => {
    db.query.mockResolvedValueOnce({ rowCount: 0 })

    await expect(Question.delete(4)).rejects.toThrow('Question with id 4 not found')
  })
})

describe('Question.update', () => {
  it('returns the updated Question', async () => {
    db.query.mockResolvedValueOnce({ rows: [{ ...row, question: 'new q' }] })

    const updated = await Question.update(4, { question: 'new q' })

    expect(updated).toBeInstanceOf(Question)
    expect(updated.question).toBe('new q')
    expect(db.query.mock.calls[0][1][7]).toBe(4) // id is the last parameter
  })

  it('throws when no row matches the id', async () => {
    db.query.mockResolvedValueOnce({ rows: [] })

    await expect(Question.update(99, { question: 'x' })).rejects.toThrow()
  })
})