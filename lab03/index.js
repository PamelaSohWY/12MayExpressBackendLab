//create .gitignore in main directory and put in node_modules as the folder to exclude

const express = require('express');
const hbs = require('hbs')

//1. Setup express
let app = express();

//2. Setup the view engine 
app.set('view engine','hbs')

//2b. Set Up static files 
app.use(express.static('public'));
//create new folder public 

// add routes here
app.get('/', function(req,res){
    res.render('index.hbs')
    //index.hbs needs to be in folder view which is same directory as index.js
})

//pass variables from the route function into the HBS file. 
app.get('/hello/:name', function(req,res){
    let name=req.params.name;
    let luckyNumber=Math.floor(Math.random()*1000)
    //generated on server, and is not javascript. Server side programming
    //registration, payment, signup for accounts shd be processed on server side
    //sercured procedures take place 
    res.render('greetings.hbs',{
        'name': name, 
        'lucky':luckyNumber 

    })
})

app.listen(3000, ()=>{
    console.log("Server started")
})
//You can use either ()=> arrow function or function()