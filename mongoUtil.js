const MongoClient = require('mongodb').MongoClient;
require('dotenv').config({path:'./.env'})
const url = process.env.MONGO_URI

let mongodb

function connect(callback){
  MongoClient.connect(url, (err, db) => {
    if (err) {throw err} 
    mongodb = db;
    callback();
  });
}
function get(){
  return mongodb
}

function close(){
  mongodb.close();
}

module.exports.connect = connect
module.exports.get = get
module.exports.close = close
