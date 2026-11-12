const authenticator = require('../../../api/middleware/authenticator')
const jwt = require('jsonwebtoken')

jest.mock('jsonwebtoken')

const mockRes = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

afterEach(() => jest.clearAllMocks())

describe('authenticator middleware', () => {
    it('returns 401 if no token is provided', () => {
        const req = { headers: {} }
        const res = mockRes()
        const next = jest.fn()

        authenticator(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(next).not.toHaveBeenCalled()
    })

    it('returns 401 if an invalid token is provided', () => {
        const req = {
            headers:
                { authorization: 'invalid-token' }
        }
        const res = mockRes()
        const next = jest.fn()
        
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error('Invalid token'), null)
        })

        authenticator(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(next).not.toHaveBeenCalled()
    })

    it('calls next if a valid token is provided', () => {
        const req = {
            headers:
                { authorization: 'valid-token' }
        }
        const res = mockRes()
        const next = jest.fn()

        const decoded = { user_id: 1 }

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, decoded)
        })

        authenticator(req, res, next)

        expect(req.user).toEqual(decoded)
        expect(next).toHaveBeenCalledTimes(1)
    })
})