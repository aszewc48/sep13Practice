const Express = require('express')
const morgan = require('morgan')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')

mongoose.connect('mongodb://localhost/authExample')
.then(data => console.log(`Connected to database -- ${data.connection.name}`))
.catch(err => console.log('Connection to database failed:', err))

const app = Express()
app.set('views', __dirname + '/views')
app.set('view engine', 'hbs')
app.set('trust proxy', 1);
 // use session
app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 60000 // 60 * 1000 ms === 1 min
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/authExample' || 'mongodb://localhost/basic-auth'
    })
  })
);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))

const authRoutes = require('./routes/auth.routes.js')
//const { application } = require('express')
app.use('/', authRoutes)




app.listen(3000, () => console.log('Yo the server is running'))