const {Router} = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator')
const router = Router()
const User = require('../models/User')

router.post('/register',
    [
        check('email', 'Invalid email').isEmail(),
        check('name', 'Don`t use any symbols except of letters').isString(),
        check('password', 'Minimal password length is 6').isLength({min: 6})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect data while registration'
            })
        }
        const {email, name, password} = req.body
        console.log(req.body)
        const candidate = await User.findOne({email})
        if (candidate) {
            return res.status(400).json(`User with email ${email} already exists`)
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({email: email, name: name, password: hashedPassword})
        await user.save()

        res.status(201).json({message: `User ${name} saved`})

    } catch (e) {
        res.status(500).json('Something went wrong while registration')
    }

})

router.post('/login',
    [
        check('email', 'Invalid email').normalizeEmail().isEmail(),
        check('password', 'Minimal password length is 6').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect data while registration'
                })
            }
            const {email, password} = req.body

            const user = await User.findOne({email})

            if(!user) {
                return res.status(400).json({message: `No users with email ${email}`})
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({message: 'Wrong credentials, try again'})
            }
            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h'}
            )

            res.json({token, userId: user.id})

        } catch (e) {
            res.status(500).json('Login error')
        }
})


module.exports = router