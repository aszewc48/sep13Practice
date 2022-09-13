const Express = require('express')
const router = Express.Router()
const User = require('../models/User.model')
const bcryptjs = require('bcryptjs')

const isAuthenticated = require('../middlewares/auth.middleware')
const isNotAuthenticated = require('../middlewares/auth.middleware')

router.get('/', (req,res,next) => {
    res.render('index.hbs')
})

router.get('/signup', isNotAuthenticated, (req,res,next) => {
    res.render('signup.hbs')
})

router.post('/signup', (req,res,next) => {
    console.log(req.body)
    const myUsername = req.body.username
    const myPassword = req.body.password

// USE BYCRYPT HERE
const myHashedPassword = bcryptjs.hashSync(myPassword)

    User.create({
        username: myUsername,
        password: myHashedPassword
    })
    .then(data => {
        console.log(`Data for username and password:`, data)
        res.send(data)
    })
    .catch(err => {
        console.log(err)
        res.render(`Something went wrong with username and password`)
    })
})

router.get('/login', isNotAuthenticated, (req,res,next) => {
    res.render('login.hbs')
})

router.post('/login', (req,res,next) => {
    console.log(req.body)
    const myUsername = req.body.username
    const myPassword = req.body.password
    User.findOne({
        username: myUsername,
    })
    .then(foundUser => {
        console.log(foundUser)
        if(!foundUser){
            res.send('no user matching this username')
            return
        }
        const isValidPassword = bcryptjs.compareSync(myPassword, foundUser.password)
        if(!isValidPassword) {
            res.send('Incorrect password')
        }
        req.session.user = foundUser
        res.redirect('/profile')
        res.render('profile.hbs', {username: foundUser.username})

    })
    .catch(err => console.log(err))
})

router.get('/profile', (req,res,next) => {
    console.log('yoooooo')
    if(req.session.user){
        res.render('profile.hbs', {username: req.session.user.username})
    } else {
        res.render('profile.hbs', { username: 'Anonymous'})
    }
})

router.get('/protected', isAuthenticated, (req,res,next) => {
    res.send('this route is protected')
})

module.exports = router