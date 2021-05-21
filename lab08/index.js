const express = require('express')
const hbs = require('hbs')
const wax = require('wax-on')
//add in Object ID as it is required for edit of food 
const ObjectId = require('mongodb').ObjectId;

//for Mongo 
//short cut for the full instruction 
const dotenv = require('dotenv');
dotenv.config(); //this function will open .env and store into Process.env , then this will be read later 

//require('dotenv').config();

async function main(){

//require in MongoUtil 
const MongoUtil = require('./MongoUtil');

//require in handlebars-helpers 
const helpers = require ('handlebars-helpers');

// 1. create the express application
let app = express();

// 2a. set the view engine
app.set('view engine', 'hbs')

// 2b. initialise handlebars-helpers 
 // const helpers = require('handlebars-helpers')({
    //     'handlebars': hbs.handlebars
    // })    
   
    helpers({
        'handlebars': hbs.handlebars
    })

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

//to view got to url and add '/food/add'
// use express through a form to add information into database

//to add something to database 
app.get('/food/add', (req,res)=>{

    res.render('add_food.hbs')
})
//process form 
app.post('/food/add', (req,res)=>{
    //let foodName = req.body.foodName;
    //let calories = req.body.calories;
   // res.send(req.body) //use this to test first
   
   let {foodName, calories, tags} = req.body;

    // check if tags is undefined. If undefined, set it to be an empty array
    tags = tags || [];

     // if tag is a single value, convert it to be an array consisting of the value
    // as its only element
    tags = Array.isArray(tags) ? tags : [tags]

    // 2 scenarios 
    //Scenario 1 : only one criteria selected  
    // assume the tags variable contains "snack"
    // tags = Array.isArray(tags) ? tags : [tags]
    //      => Array.isArray("snack") ? "snack" : ["snack"]
    //   left is string and the right is an array 
    //      => false ? "snack" : ["snack"]
    //      => ["snack"]
    // tags => ["snack"]
 
    //Scanario 2: more than one criteria selected (2 or more)
    // assume the tags variable contains ["unhealthy", "homecooked"]
    // tags = Array.isArray(tags) ? tags : [tags]
    //      => Array.isArray(["unhealthy", "homecooked"]) ? ["unhealthy", "homecooked"] : [["unhealthy", "homecooked"]]
    // left - string  array and right - array in array (nested array) 
    //      => true ? ["unhealthy", "homecooked"] : [["unhealthy", "homecooked"]]
    //      => ["unhealthy", "homecooked"] 
    // tags = ["unhealthy", "homecooked"]

    //to add this doc into mongodb 
    let db = MongoUtil.getDB();
    //getDB function is in MongoUtil 
    //into food collection, iu 
    db.collection('food').insertOne({ //insertOne is used here 
    'foodName': foodName,
    'calories' : calories,
    'tags': tags
});
//res.send("Food added")
res.redirect('/food')

})

//To show all food in the database

app.get('/food', async (req,res)=>{
    let db = MongoUtil.getDB();
    // find all the food and convert the results to an array 
    let results = await db.collection('food').find().toArray();
    res.render('food',{
        'foodRecords': results 

        //results i will store in food.hbs as foodRecords
    })

})


/// display the form to edit a food item
app.get('/food/:foodid/edit', async (req, res) => {
    let db = MongoUtil.getDB();
    let foodId = req.params.foodid;
    // findOne will always give you back one object
    let foodRecord = await db.collection('food').findOne({
        "_id": ObjectId(foodId)
    })
    res.render('edit_food',{
        foodRecord
    })
})


//edit the form 
//Note yarn add handlebars-helpers to enble in array to be used 
app.post('/food/:foodid/edit', async(req,res)=>{
    let { foodName, calories, tags } = req.body;
    let foodId = req.params.foodid;
    tags = tags || []; //if tags is undefined, it will default 
    tags = Array.isArray(tags) ? tags : [tags]
;

//Update the document 
//put method
//need to specifically use UpdateOne
let db = MongoUtil.getDB();
await db.collection('food').updateOne({
    '_id':ObjectId(foodId)
},{
    '$set': {
        foodName, calories, tags
    }
})

res.redirect('/food')
})

//Delete the document 
app.get('/food/:foodid/delete', async(req,res)=>{
    let db = MongoUtil.getDB();

    let foodRecord = await db.collection('food').findOne({
        '_id':ObjectId(req.params.foodid)
    })
    res.render('delete_food',{
        foodRecord
})
})

app.post('/food/:foodid/delete', async(req,res) =>{
    let db = MongoUtil.getDB();
    await db.collection('food').deleteOne({
        '_id':ObjectId(req.params.foodid)
    })
   
    res.redirect('/food')

}
)

//render form to allow the user to add note 
app.get('/food/:foodid/notes/add', async(req,res)=>{
    let db = MongoUtil.getDB();
    let foodRecord = await getFoodById(req.params.foodid)


        res.render('add_note', {
            'food': foodRecord 
        })
    })


app.post('/food/:foodid/notes/add', async(req,res)=>{
   let db = MongoUtil.getDB();
   let noteContent = req.body.content;
   await db.collection('food').updateOne({
       '_id': ObjectId(req.params.foodid)
   },{
       '$push':{
           'notes':{
               '_id':ObjectId(),
               'content': noteContent
           }
       }

   })
   res.redirect('/food')

})

//see the notes and details of a food document 
app.get('/food/foodid', async (req,res)=>{
    let db = MongoUtil.getDB();
    let foodRecord = await getFoodById(req.params.foodid);
    res.render('food_details', {
        'food': foodRecord
    })
})

//display the form to update a note 
app.get('/notes/:noteid/edit', async(req,res)=>{
    let db = MongoUtil.getDB();
    let foodRecord = await db.collection('food').findOne({
        'notes._id':ObjectId(req.params.noteid)
    },{
        'projection':{
            'notes':{
                '$elemMatch':{
                    '_id':ObjectId(req.params.noteid)
                }
            }
        }
    })

    let noteToEdit = foodRocord.notes[0];
    res.render('edit_note', {
        'note': noteToEdit
    })
})

app.post('/notes/:noteid/edit', async(req,res)=>{
    let db = MongoUtil.getDB();

    let foodRecord = await db.collection('food').findOne({
        'notes._id':ObjectId(req.params.noteid)
    });

    await db.collection('food').updateOne({
    'notes._id':ObjectId(req.params.noteid)
    },{
        '$set':{
            'notes.$.content':req.body.content
        }

    })
    
    res.redirect('/food/' +foodRecord._id);

})


// 7. start the server
app.listen(3000, ()=>{
    console.log("Server has started")
})

}
main();
