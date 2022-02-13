const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../../app')
const { Customer } = require("../../models/Customer")

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
})