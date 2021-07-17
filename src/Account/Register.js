const express = require('express')
const bcrypt = require ('bcrypt')
const dotenv = require('dotenv')
dotenv.config()
var mongo = require( '../../mongoUtil' );
const db = mongo.get().db(process.env.DATABASE)

var router = express.Router()
var key = process.env.REGISTRATION_KEY 

var myLogger = function (req, res, next) {
    console.log('register LOGGED : ' + key)
    next()
}

router.use(myLogger);



router.post('/', function(req, res) {
    //console.log(req.body)
    //console.log(req.body.key + " : " + key)
    if (req.body.key == key) {
        var username = String(req.body.username)
        var password = String(req.body.password)
        inserted = false
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, function(err, hash) {
            if (err) throw err
            var loginInfo = {username: username, password: hash}
            var query = {username: username}
            db.collection("Login").find(query).toArray(function(err, results) {
                if (err) throw err
                if (results.length == 0) {
                    db.collection("Login").insertOne(loginInfo, function(err, resp) {
                        if (err) throw err
                        //console.log("Inserted user: ", res)
                        res.send("200")
                        db.close
                        inserted = true
                    })
                } else {
                    console.log("User with same username")
                    res.send("409")
                }
            })
        })
    } else {
        console.log("Wrong Key")
        res.send("401")
    }
})

module.exports = router;