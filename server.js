const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const session = require('express-session')
const dotenv = require('dotenv')
dotenv.config()
const app = express()
app.use(cors())
const sessionData = {
    secret: process.env.SESSION_SECRET || 'Super Secret (change it)',
    resave: true,
    saveUninitialized: false,
    cookie: {
    sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', // must be 'none' to enable cross-site delivery
    secure: process.env.NODE_ENV === "production", // must be true if sameSite='none'
    }
}
app.use(
    session(sessionData)
);
const corsConfig = {
    credentials: true,
    origin: [process.env.FRONTEND_APP_URL]
}
app.use(
    cors(corsConfig)
);

var loginRouter = require('./src/Account/Login')
var registerRouter = require('./src/Account/Register')
var mediphorsRouter = require('./src/Mediphors/Mediphors')

app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use('/login', loginRouter)
app.use('/register', registerRouter)
app.use('/mediphors', mediphorsRouter)


app.listen(8080, () => console.log('API is running on port 8080'))