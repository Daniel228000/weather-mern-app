const {Router} = require('express')
const config = require('config')
const router = Router()
const User = require('../models/User')

router.get('/:id/:city', async (req, res) => {
    try {
        let cities = await User.findById({_id: req.user.userId}).select('cities')
        cities = cities.push(req.params.city)
        await User.updateOne({_id: req.user.userId}, {})
        res.json(cities)
    } catch (e) {
        res.status(500).json('Something went wrong while forecasting')
    }
})