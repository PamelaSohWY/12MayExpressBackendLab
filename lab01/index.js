// yarn add express- > cause node module to show up
//imported express as package and it is in node modules folder 
//Do not move or delete any files in node modules

//To import in express package (import only after express package installed in node modules folder)
//code:
const express = require('express');

//nodejs application contains node module, index, package and yarn 

//Create a variable to store express application 
//code:
const app = express();

//add routes here 

//define a new route 
//a route is a URL on your server that the browswer can access 
//app.get is to get the browser to get information 
//each resp or request is treated as a new transaction. the function does not remeber it 
//request method (get/ post etc) and request URL 
//code:
app.get('/',function(req,res){
    // req --> what browser sent to server 
    //res --> what server will send back 
    //code:
    res.send ('<h1>Hello from Express</h1>')
})

// expose the server for the other browsers to connect to
// the 3000 is the port number
//Route number is for the operating system to be able to recognize them 
// There are famous port numbers (windows:80)
//code
app.listen(3000, function(){
    console.log("Server started")
})