const express = require('express')
const bcrypt = require ('bcrypt')
const dotenv = require('dotenv')
dotenv.config()

var router = express.Router()

var myLogger = function (req, res, next) {
    console.log('register LOGGED')
    next()
}

router.use(myLogger);

var MongoClient = require('mongodb').MongoClient
var url = process.env.MONGO_URI

router.post('/', function(req, res) {
    res.cookie('cookie', 'value', { sameSite: 'none', secure: true });
    var username = String(req.body.username)
    var password = String(req.body.password)
    inserted = false
    MongoClient.connect(url, function(err,db) {
        if (err) throw err
        var dbo = db.db("Mediphors")
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, function(err, hash) {
            if (err) throw err
            var loginInfo = {username: username, password: hash}
            var query = {username: username}
            dbo.collection("Login").find(query).toArray(function(err, results) {
                if (err) throw err
                if (results.length == 0) {
                    dbo.collection("Login").insertOne(loginInfo, function(err, res) {
                        if (err) throw err
                        console.log("Inserted user: ", res)
                        db.close
                        inserted = true
                    })
                } else {
                    console.log("User with same username")
                }
            })
        })
    })
    if (inserted) ; else res.send("Error")
})

module.exports = router;