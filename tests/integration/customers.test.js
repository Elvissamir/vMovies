const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../../app')
const { Customer } = require("../../models/Customer")
const { User } = require('../../models/User')

describe('Route /api/customers', () => {
    afterEach(async () => {
        await Customer.deleteMany()
    })
    
    describe('GET /', () => {
        it('Should return all customers', async () => {
            const customerA =  {
                isGold: true,
                first_name: 'fnameA',
                last_name: 'lnameA',
                phone: "04242403945"
            } 
    
            const customerB =  {
                isGold: true,
                first_name: 'fnameA',
                last_name: 'lnameA',
                phone: "04242403945"
            }
    
            await Customer.collection.insertMany([
                customerA,
                customerB
            ])

            const res = await request(app).get('/api/customers')
            
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(Object.keys(res.body[0]))
                .toEqual(expect.arrayContaining([
                    'first_name', 
                    'last_name',
                    'phone',
                    'isGold'
                ]))
        })
    })

    describe('GET /:id', () => {
        it('Should return the customer by given id', async () => {
            const customerC = new Customer({
                isGold: true,
                first_name: 'fnameA',
                last_name: 'lnameA',
                phone: "04242403945"
            })

            await customerC.save()

            const res = await request(app).get(`/api/customers/${customerC._id}`)
            
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('first_name', customerC.first_name)
            expect(res.body).toHaveProperty('last_name', customerC.last_name)
            expect(res.body).toHaveProperty('phone', customerC.phone)
            expect(res.body).toHaveProperty('isGold', customerC.isGold)
        })

        it('Should return 404 if the customer does not exist', async () => {
            const randomId = mongoose.Types.ObjectId()

            const res = await request(app).get(`/api/customers/${randomId}`)
            expect(res.status).toBe(404)
        })

        it('Should return 404 if the given id is invalid', async () => {
            const invalidId = 1

            const res = await request(app).get(`/api/customers/${invalidId}`)
            expect(res.status).toBe(404)
        })
    })

    describe('POST /', () => {
        let token 

        beforeEach(() => {
            token = new User().generateAuthToken()
        })

        const sendPostRequest = (data) => {
            return request(app)
                .post('/api/customers')
                .set('x-auth-token', token)
                .send(data)
        }

        it('Should create and store a new customer with given data', async () => {
            const data = {
                isGold: true,
                first_name: 'cfname',
                last_name: 'clanme',
                phone: "55555555545"
            }
            
            const res = await sendPostRequest(data)

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('first_name', data.first_name)
            expect(res.body).toHaveProperty('last_name', data.last_name)
            expect(res.body).toHaveProperty('phone', data.phone)
            expect(res.body).toHaveProperty('isGold', data.isGold)
        })

        it('Should return 401 if the user is not logged in', async () => {
            token = ''
            const data = {
                isGold: true,
                first_name: 'cfname',
                last_name: 'clanme',
                phone: "55555555545"
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(401)
        })

        it('Should return 400 if first_name is not provided', async () => {
            const data = {
                isGold: true,
                last_name: 'clanme',
                phone: "55555555545"
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if first_name has less than 2 letters', async () => {
            const data = {
                isGold: true,
                first_name: 'a',
                last_name: 'clanme',
                phone: "55555555545"
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if first_name has more than 15 letters', async () => {
            const data = {
                isGold: true,
                first_name: 'abcdefghijklmnopqrs',
                last_name: 'clanme',
                phone: "55555555545"
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if last_name is not provided', async () => {
            data = {
                isGold: true,
                first_name: 'cfname',
                phone: "55555555545"
            }

            const res = await sendPostRequest()
            expect(res.status).toBe(400)
        })

        it('Should return 400 if last_name has less than 2 letters', async () => {
            data = {
                isGold: true,
                first_name: 'cfname',
                last_name: 'a',
                phone: "55555555545"
            }
            const res = await sendPostRequest()
            expect(res.status).toBe(400)
        })

        it('Should return 400 if last_name has more than 15 letters', async () => {
            const data = {
                isGold: true,
                first_name: 'cfname',
                last_name: 'abcdefghijklmnopqrs',
                phone: "55555555545"
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if isGold property is not provided', async () => {
            const data = {
                first_name: 'cfname',
                last_name: 'clname',
                phone: "55555555545"
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if isGold is not a boolean', async () => {
            const data = {
                isGold: 'notBoolean',
                first_name: 'cfname',
                last_name: 'clanme',
                phone: "55555555545"
            }
            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if phone is not provided', async () => {
            const data = {
                isGold: true,
                first_name: 'cfname',
                last_name: 'clname',
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if last_name has less than 11 numbers', async () => {
            const data = {
                isGold: true,
                first_name: 'cfname',
                last_name: 'clanme',
                phone: "1"
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })

        it('Should return 400 if phone has more than 11 numbers', async () => {
            const data = {
                isGold: true,
                first_name: 'cfname',
                last_name: 'clanme',
                phone: "'01234567891011213'"
            }

            const res = await sendPostRequest(data)
            expect(res.status).toBe(400)
        })
    })
})