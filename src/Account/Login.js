const express = require('express')
const bcrypt = require ('bcrypt');
const dotenv = require('dotenv')
dotenv.config()

var mongo = require( '../../mongoUtil' );
const db = mongo.get().db(process.env.DATABASE)

var router = express.Router()

var myLogger = function (req, res, next) {
    console.log('login LOGGED')
    next()
}

router.use(myLogger)

var url = process.env.MONGO_URI

router.post('/', function(req, res) {
    var username = req.body.username
    var password = req.body.password
    if (!username || !password) {
        console.log("error")
        res.send("Error")
    } else {
        var query = {username: username}
        db.collection("Login").find(query).toArray(function(err, results) {
            if (err) throw err
            if (results.length > 0) {
                bcrypt.compare(password, results[0].password, function (err, result) {
                    if (err) throw err
                    console.log (result)
                    if (result) {
                        console.log("Login Success")
                        res.send({
                            token: 'test123'
                        })
                    } else {
                        console.log("Login Fail")
                        res.send('Fail')
                    }
                })
                
            } else {
                console.log("User not found")
            }
        })
    }
})

module.exports = router;