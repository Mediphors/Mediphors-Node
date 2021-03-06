let express = require('express')
let router = express.Router()
const dotenv = require('dotenv')
dotenv.config()
let AWS = require('aws-sdk')
var mongoUtil = require( '../../mongoUtil' )
var mongo = require( '../../mongoUtil' );
const db = mongo.get().db(process.env.DATABASE)

AWS.config.update({accessKeyId: process.env.ACCESS_KEY_ID, secretAccessKey: process.env.SECRET_ACCESS_KEY, region: 'us-west-1'});
let s3 = new AWS.S3();

router.use(express.json())
router.use(express.urlencoded({ extended: true }))
let myLogger = function (req, res, next) {
    //console.log('/Mediphors logged')
    next()
}
router.use(myLogger)

let MongoClient = require('mongodb').MongoClient
let url = process.env.MONGO_URI

function parseHashtags(hashtags) {
    let hashtagList = hashtags.split(' ')
    let list = []
    for (let i = 0; i < hashtagList.length; i++) {
        if (hashtagList[i].includes('#'))
            list.push(hashtagList[i])
    }
    return list
}

router.post('/', function(req, res) {
    description = req.body.description
    hashtags = parseHashtags(req.body.hashtags)
    imageURL = req.body.imageURL
    translations = {}
    console.log(description, hashtags, imageURL)
    inserted = false

    if (!(description || hashtags) || !imageURL) {
        console.log("error")
        res.send("Error")
    } else {
        var query = {description: description}
        var mediphorInfo = {description: description, hashtags: hashtags, imageURL: imageURL, translations}
        db.collection(process.env.COLLECTION).find(query).toArray(function(err, results) {
            if (err) throw err
            if (results.length == 0) {
                db.collection(process.env.COLLECTION).insertOne(mediphorInfo, function(err, result) {
                    if (err) throw err
                    //console.log("Inserted: ", result['ops'])
                    inserted = true
                    res.send(result['ops'])
                })
            } else {
                console.log("Mediphor already exists")
                key = req.body.imageURL.split('/').pop()
                var params = {Bucket: process.env.BUCKET, Key: key}
                s3.deleteObject(params, function(err, data) {
                    if (err) console.log(err, err.stack);  // error
                    else {
                        console.log("Deleted image: " + key)
                        res.send("304")
                    }
                })
            }
        })
    }
})

router.get('/', function(req, res) {
    language = req.query.language
    newResult = []
    description = ""
    db.collection(process.env.COLLECTION).find().toArray(function(err, results) {
        if (err) throw err
        if (results.length > 0) {
            results.map((mediphor) => { 
                description = mediphor.description
                if (language) {
                    if (mediphor.translations) {
                        if (mediphor.translations[language]) {
                            description = mediphor.translations[language].description
                        }
                    }
                    newResult.push({description: description, hashtags: mediphor.hashtags, imageURL: mediphor.imageURL})
                } else {
                    newResult.push({description: description, hashtags: mediphor.hashtags, imageURL: mediphor.imageURL})
                }
            })
            //console.log(newResult)
            res.send(newResult)
        } else {
            console.log("No Mediphors")
            res.send("")
        }
    })
})

router.post('/translate', function(req, res) {
    imageURL = req.body.mediphor.imageURL
    translations = req.body.mediphor.translations
    translations.push(req.body.translation)
    var query = {imageURL: imageURL}
    var newMediphor = {$set: {translations: translations}}
    if (query) {
        db.collection(process.env.COLLECTION).updateOne(query, newMediphor, function(err, results) {
            if (err) throw err
            else //console.log("Mediphor updated: \n", results)
            res.send("200")
        })
    } else {
        console.log("Empty Mediphor ID")
        res.send("400")
    }
})

router.post('/mediphor', function(req, res) {
    imageURL = req.body.imageURL
    var query = {imageURL: imageURL} 
    db.collection(process.env.COLLECTION).find(query).toArray(function(err, results) {
        if (err) throw err
        if (results.length > 0) {
            //console.log(results)
            res.send(results)
        } else {
            console.log("No Mediphor")
            res.send("")
        }
    })
})

router.post('/update', function(req, res) {
    let imageURL = req.body.imageURL
    language = req.body.language
    console.log(language)
    var query = {imageURL: imageURL}
    if (query) {
        if (language) {
            db.collection(process.env.COLLECTION).find(query).toArray(function(err, results) {
                if (err) throw err
                if (results.length > 0) {
                    console.log(results)
                    translations = results[0].translations
                    translations.push({[language]: {
                        description: req.body.description
                    }})
                    var newMediphor = {$set: {translations: translations}}
                    db.collection(process.env.COLLECTION).updateOne(query, newMediphor, function(err, results) {
                        if (err) throw err
                        else //console.log("Mediphor updated: \n", results)
                        res.send("200")
                    })
                } else {
                    console.log("No Mediphor")
                    res.send("")
                }
            })
        } else {
            var newMediphor = {$set: {description: req.body.description}}
            db.collection(process.env.COLLECTION).updateOne(query, newMediphor, function(err, results) {
                if (err) throw err
                else //console.log("Mediphor updated: \n", results)
                res.send("200")
            })
        }
    } else {
        console.log("Empty Mediphor ID")
        res.send("400")
    }
})

router.post('/delete', function(req, res) {  
    let imageURL = req.body.imageURL
    var query = {imageURL: imageURL}
    //console.log(query)
    key = req.body.imageURL.split('/').pop()
    var params = {Bucket: process.env.BUCKET, Key: key};
    //console.log(params)
    s3.deleteObject(params, function(err, data) {
        if (err) console.log(err, err.stack);  // error
        else {
            db.collection(process.env.COLLECTION).deleteOne(query, function(err, results) {
                //console.log(results['deletedCount'])
                if (err) throw err
                else res.send("200")
            })
        }
    })
})

router.get('/upload', function(req, res) {
    var lambda = new AWS.Lambda();
    var params = {
        FunctionName: 's3uploader-UploadRequestFunction-CbEzNJT7gPtz'
    };
    lambda.invoke(params, function(err, data) {
        if (err) {
            console.log(err)
            res.send(err)
        }
        else {
            payload = JSON.parse(data.Payload)
            //console.log(payload['body'])
            res.send(payload['body'])
        }
    });
})

module.exports = router;