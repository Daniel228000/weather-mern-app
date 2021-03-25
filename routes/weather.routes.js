const {Router} = require('express')
const weather = require('openweather-apis')
const geolocation = require("geolocation");

const router = Router()
weather.setLang('ru')
weather.setUnits('metric');
weather.setAPPID('50be9722c8e77bb21025899a1c14e9c8')


router.get('/forecast/:lat/:lon', async (req, res) => {
    try {
        weather.setCoordinate(req.params.lat, req.params.lon)
        weather.getAllWeather(function (err, temp){
            console.log(temp)
            res.json(temp)
        })
    } catch (e) {
        res.status(500).json('Something went wrong while forecasting')
    }
})

module.exports = router
