const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const session = require('express-session')
var mongoUtil = require('./mongoUtil')
const dotenv = require('dotenv')
dotenv.config()
const app = express()
app.use(cors())

mongoUtil.connect( () => {
    var loginRouter = require('./src/Account/Login')
    var registerRouter = require('./src/Account/Register')
    var mediphorsRouter = require('./src/Mediphors/Mediphors')

    app.use(bodyParser.urlencoded({extended : true}))
    app.use(bodyParser.json())
    app.use('/login', loginRouter)
    app.use('/register', registerRouter)
    app.use('/mediphors', mediphorsRouter)


    app.listen(process.env.PORT, () => console.log('API is running on port ', process.env.PORT))
  } );