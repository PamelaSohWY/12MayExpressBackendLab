const express = require('express')
const hbs = require('hbs')
const wax = require('wax-on')
//for Mongo 
//short cut for the full instruction 
const dotenv = require('dotenv');
dotenv.config(); //this function will open .env and store into Process.env , then this will be read later 

//require('dotenv').config();

async function main(){

//require in MongoUtil 
const MongoUtil = require('./MongoUtil')

// 1. create the express application
let app = express();

// 2. set the view engine
app.set('view engine', 'hbs')

// 3. where to find the public folder
app.use(express.static('public'))

// 4. set up wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

// 5. set up forms
app.use(express.urlencoded({
    extended: false
}))

//6. Connect to Mongo
// read in the environment variables
//process.env is for environmant variables 
//test if the database can be connected.
//function is async so that it can 
await MongoUtil.connect(process.env.MONGO_URI,'food_tracker')

// 6. Define the routes 

// root route
// this is an arrow function(optional to use )
app.get('/', (req,res)=>{
    res.send("Hello World")
})

//Reminder to yarn add mongodb
//go to MongoDB to connect and get the link via link throug application
// .env file to store password ( yarn add dotenv) - if doesnt show up - must do it manually 
//put morgourl in env 
//put .env in gitirgnore

//to add something to database 
app.get('/food/add', (req,res)=>{

    res.render('add_food.hbs')
})
//process form 
app.post('/food/add', (req,res)=>{
    let foodName = req.body.foodName;
    let calories = req.body.calories;
   // res.send(req.body) //use this to test first
   
   
   
    //to add this doc into mongodb 
    let db = MongoUtil.getDB();
    //getDB function is in MongoUtil 
    //into food collection, iu 
    db.collection('food').insertOne({ //insertOne is used here 
    'foodName': foodName,
    'calories' : calories
});
res.send("Food added")

})

//to view got to url and add '/food/add'
// use express through a form to add information into database

// 7. start the server
app.listen(3000, ()=>{
    console.log("Server has started")
})
}

main();
