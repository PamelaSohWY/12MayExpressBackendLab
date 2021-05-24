//setup express
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const MongoUtil = require('./MongoUtil')

let app = express();

//enable JSON as the transfer data format;
app.use(express.json());
//make sure express.json is a function call 

//enable CORS
app.use(cors())

async function main() {
    let db = await MongoUtil.connect(process.env.MONGO_URI, "food_sightings")
    console.log("ready to go")
}

//What is the purpose of the API? 
//-Create new information 
//-Read existing information 
//-Update existing information 
//-Update existing information 
//-Delete existing information

//What is the data needed?
//Eg. To show all the possible free food listing (no data from client required)
//eg. show all food listing between start date and end date => need start date and end date from client (browser or smart watch)
//and 2B - what is the json format

//what is the data which we send back to the client 
//C => send back the object or document hat is newly created 
//R => send back the documents that matches the criteria if any is given 
//U ==> send back the document hat is updated
//D ==> send back the document that is deleted 

//END Point : Add a new free food sighting to the database 
// When we create, we always POST method

app.post('/free_food_sighting', async(req,res)=>{
    //we need category , location, date
    //we expect the client to send us a JSON object in the following format:
    //{
        //'location':'LT2',
        //'food': 'Western food',
        // 'date': "2020-01-01"
    //}

    let location = req.body.location;
    let food = req.body.food;
    let date = req.body.date;
    let db = MongoUtil.getDB();
    let result = await db.collection('food').insertOne({
        'food':food,
        'location':location,
        'date': new Date(date)// to create an ISO Date Object from a string

    })
    //insert data in 

})

main()

app.listen(3000, ()=>{
    console.log("server started")
})

