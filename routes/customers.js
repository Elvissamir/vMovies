const router = require('express').Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const { Customer, validateCustomer } = require('../models/Customer')
const validateObjectId = require('../middleware/validateObjectId')



router.get('/', async (req, res) => {
    const customers = await Customer.find()
    res.send(customers)
})

router.get('/:id', validateObjectId ,async (req, res) => {
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(404).send('The customer does not exist.')

    res.send(customer)
})

router.post('/', auth, async (req, res) => {
    const { error } = validateCustomer(req.body)
    if (error) return res.status(400).send(error.details[0].message) 

    const customer = new Customer({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        isGold: req.body.isGold,
    })
    
    await customer.save()

    res.send(customer)
})

router.put('/:id', auth, async (req, res) => {
    const data = req.body

    const { error } = validateCustomer(data)
    if (error) return res.status(400).send(error.details[0].message)
    
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(404).send('The customer does not exist.')

    customer.first_name = data.first_name
    customer.last_name = data.last_name
    customer.isGold = data.isGold
    customer.phone = data.phone

    await customer.save()
    res.send(customer)
})

/*

router.delete('/:id', [ auth, admin ], async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id)
    if (!customer) return res.status(404).send('The customer does not exist.')

    res.send(customer)
})

*/

module.exports = router