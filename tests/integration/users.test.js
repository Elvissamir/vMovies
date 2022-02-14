const app = require('../../app')
const request = require("supertest")
const { User } = require('../../models/User')

describe('Route /api/users', () => {
    describe('GET /', () => {
        let token
        
        beforeEach(async () => {
            await User.collection.insertMany([
                {
                    first_name: "fnameA",
                    last_name: "lnameA",
                    phone: "04443455434",
                    email: "userA@mail.com",
                    password: "password",
                    isAdmin: false,
                },
                {
                    first_name: "fnameB",
                    last_name: "lnameB",
                    phone: "04443455434",
                    email: "userB@mail.com",
                    password: "password",
                    isAdmin: false,
                }
            ])

            token = new User().generateAuthToken()
        })

        afterEach(async () => {
            await User.deleteMany()
        })

        const sendGetRequest = () => {
            return request(app).get('/api/users').set('x-auth-token', token)
        }

        it('Should return all the users', async () => {
            const res = await sendGetRequest()

            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(Object.keys(res.body[0]))
            .toEqual(expect.arrayContaining([
                'first_name', 
                'last_name',
                'email',
                'phone',
                'isAdmin'
            ]))
        })

        it('Should return 401 if the user is not authorized', async () => {
            token = ''
            const res = await sendGetRequest()

            expect(res.status).toBe(401)
        })
    })
})