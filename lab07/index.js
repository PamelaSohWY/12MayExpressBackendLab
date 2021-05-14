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

//UPDATE in CRUD 

// part 1
//display the form that shows existing pet information 
app.get('/pet/:petId/update', async function(req,res) {
    //1.fetch the existing pet information the database 
    let petID = req.params.petId;
    let response = await axios.get(baseUrl +'/pet/' + petID);

//populate the form with existing pet's information
res.render ('edit_pet', {
    'pet': response.data
})
})

//update the pet (ie process the form)
app.post('/pet/:petID/update', async function(req,res){
    let petID = req.params.petID;
    //fetch the existing pet information
    let response = await axios.get(baseUrl + '/pet/' + req.params.petID);
    let oldPet = response.data; 

    //fetch the new petName and the new petCategory 
    let newPetName = req.body.petName;
    let newPetCategory = req.body.petCategory;

    let newPet ={
        "id" : req.params.petID, 
        "category":{
            "id": oldPet.category.id, 
            "name": newPetCategory 
        }, 
        "name": newPetName,
        "photoUrls": [
          "n/a"
        ],
        "tags": [
        ],
        "status": "available"
    }

response = await axios.put(baseUrl + '/pet', newPet);
      // go to the /pets URL
      res.redirect('/pets')
})

//DELETE IN CRUD
//display a confirmation form 
app.get('/pet/:petID/delete', async function(req,res){
    let petID=req.params.petID;
    let response= await axios.get(baseUrl + '/pet/' + petID);
    console.log(response);
    let pet = response.data; 
    res.render('delete_pet',{
        'pet': pet
    })
})

//process the delete 
app.post('/pet/:petID/delete', async function(re,res){
    let petID = req.params.petID;
    let response = await axios.delete(baseUrl + '/pet/' + perID);
    res.redirect('/pets')
})


// 3. START SERVER
app.listen(3000, function(){
    console.log("Server has started")
})