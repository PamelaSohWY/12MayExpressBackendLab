// include express, hbs and wax-on
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');

// 1. create the express app
let app = express();

// 1b. set the view engine
app.set('view engine', 'hbs');

// 1c. set up the wax on
wax.on(hbs.handlebars);

// this is where HBS will look for any file
// that we are extending from
wax.setLayoutPath('./views/layouts')

// enable forms
// ULTRA-IMPORTANT
app.use(express.urlencoded({
    extended: false
}))

//2. Routes - correct
app.get('/bmi', function(req,res){
    res.render('bmi')
})

//takes place on server side, it will be secured

app.post('/bmi', function(req,res){

    res.send(req.body)
      //console.log("Form has been received");
      //res.send("Form received")
     // console.log(req.body);

     // let userWeight = req.body.userweight;
     // let userHeight = req.body.userheight;
      

})


// 3. START SERVER
app.listen(3000, function(){
    console.log("Server has started")
})