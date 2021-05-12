const express = require('express');

let app = express();

app.get('/', function(req,res){
    res.send("<h1>No place holder</h1>")
}
)

// add routes here
//Process request 
//:name is a placeholder, the parameter name , this code reads the name which the user will put in 
app.get('/hello/:name', function(req,res){
    let name= req.params.name;
    res.send("Hi,"+ name);
})

app.listen(3000, ()=>{
    console.log("Server started")
})
