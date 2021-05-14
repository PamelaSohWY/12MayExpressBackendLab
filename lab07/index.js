// include express, hbs, axios and wax-on 
const express = require('express');
const hbs = require('hbs');
const axios = require('axios');
const wax = require('wax-on');

//1. create the express app 
let app = express();

//1b Set the view engine 
app.set('view engine','hbs');

//1c Set up the wax-on 
wax.on(hbs.handlebars);

//HBS look for files 
wax.setLayoutPath('./views/layouts')

//enable forms
app.use(express.urlencoded({
    extended:false
}))

//make part of the url a variable 
const baseUrl =  'https://petstore.swagger.io/v2';

// routes 

//READ in CRUD
app.get('/pets',async function(req,res){
    //use axios, so function have to be async
    
    let response = await axios.get(baseUrl + '/pet/findByStatus', {
        params:{
            'status':'available'
        }
    });
    res.render('pets',{
        'allPets':response.data
    })
})

app.get('/pets2', async function(req,res){

    let response = await axios.get(baseUrl + '/pet/findByStatus',{
        params:{
            'status':'sold'
        }
    })
    res.render('pets2', {
        'allPets2':response.data
    })

})

//CREATE in CRUD

//need to get and render page first

app.get('/pet/create', function(req,res){
    res.render('create_pet')
})

// need to post the form details into URl

app.post('/pet/create', async function(req,res){
        let petName = req.body.petName;
        let category = req.body.petCategory;

        let newPet = {
            "id": Math.floor(Math.random() * 100000 + 10000),
        "category": {
          "id": Math.floor(Math.random() * 1000000 + 100000),
          "name": category
        },
        "name": petName,
        "photoUrls": [
          "n/a"
        ],
        "tags": [
        ],
        "status": "available"

}
let response = await axios.post(baseUrl + "/pet", newPet);
      res.send(response.data);

})



// 3. START SERVER
app.listen(3000, function(){
    console.log("Server has started")
})