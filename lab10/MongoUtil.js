//this is a closed up blackbox. 
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

//const MongoClient = require('mongodb').MongoClient;

//MongoClient is the programm that talks between MongoDB and Client 

//global variable
let _db;

//creates a connection to a mongo database 
async function connect(url, dbname){
    let client = await MongoClient.connect(url,{
        useUnifiedTopology:true
    }
    )
//for selection of which database to use 
_db = client.db(dbname);
console.log("Database connected")
}

function getDB(){
    return _db
}

module.exports ={
    connect, getDB 
}

//the way to export variable is above so that index.js can use function connect, and getDB