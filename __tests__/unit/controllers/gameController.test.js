const gameController = require('../../../api/controllers/gameController')
const Question = require('../../../api/model/GameModels')

jest.mock('../../../api/model/GameModels')

const mockRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

afterEach(() => jest.clearAllMocks())

describe('index', () => {
  it('returns 200 and all questions', async () => {
    Question.getAll.mockResolvedValue([{ id: 1 }])
    const res = mockRes()

    await gameController.index({}, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith([{ id: 1 }])
  })

  it('returns 500 if the model throws', async () => {
    Question.getAll.mockRejectedValue(new Error('fail'))
    const res = mockRes()

    await gameController.index({}, res)

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'fail' })
  })
})

describe('show', () => {
  it('returns 200 and questions for the topic', async () => {
    Question.findByTopic.mockResolvedValue([{ id: 1 }])
    const res = mockRes()

    await gameController.show({ params: { topic: 'maths' } }, res)

    expect(Question.findByTopic).toHaveBeenCalledWith('maths')
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('returns 404 when no questions match', async () => {
    Question.findByTopic.mockResolvedValue([])
    const res = mockRes()

    await gameController.show({ params: { topic: 'maths' } }, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'No questions found for topic maths' })
  })

  it('returns 500 if the model throws', async () => {
    Question.findByTopic.mockRejectedValue(new Error('fail'))
    const res = mockRes()

    await gameController.show({ params: { topic: 'maths' } }, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })
})

describe('create', () => {
  it('returns 201 and the new question', async () => {
    Question.create.mockResolvedValue({ id: 5 })
    const res = mockRes()

    await gameController.create({ body: { text: 'Q?' } }, res)

    expect(Question.create).toHaveBeenCalledWith({ text: 'Q?' })
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ id: 5 })
  })

  it('returns 500 if the model throws', async () => {
    Question.create.mockRejectedValue(new Error('fail'))
    const res = mockRes()

    await gameController.create({ body: {} }, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })
})

describe('destroy', () => {
  it('returns 200 when deleted', async () => {
    Question.delete.mockResolvedValue({ id: 2 })
    const res = mockRes()

    await gameController.destroy({ params: { id: '2' } }, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'Question with id 2 deleted successfully' })
  })

  it('returns 404 when the question is not found', async () => {
    Question.delete.mockResolvedValue(null)
    const res = mockRes()

    await gameController.destroy({ params: { id: '2' } }, res)

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'Question with id 2 not found' })
  })

  it('returns 500 if the model throws', async () => {
    Question.delete.mockRejectedValue(new Error('fail'))
    const res = mockRes()

    await gameController.destroy({ params: { id: '2' } }, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })
})

describe('update', () => {
  it('returns 200 and the updated question', async () => {
    Question.update.mockResolvedValue({ id: 2, text: 'New' })
    const res = mockRes()

    await gameController.update({ params: { id: '2' }, body: { text: 'New' } }, res)

    expect(Question.update).toHaveBeenCalledWith('2', { text: 'New' })
    expect(res.status).toHaveBeenCalledWith(200)
  })

  it('returns 404 when the question is not found', async () => {
    Question.update.mockResolvedValue(null)
    const res = mockRes()

    await gameController.update({ params: { id: '2' }, body: {} }, res)

    expect(res.status).toHaveBeenCalledWith(404)
  })

  it('returns 500 if the model throws', async () => {
    Question.update.mockRejectedValue(new Error('fail'))
    const res = mockRes()

    await gameController.update({ params: { id: '2' }, body: {} }, res)

    expect(res.status).toHaveBeenCalledWith(500)
  })
})

