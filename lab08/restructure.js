// Lesson on restucturing and destructing 

   // let foodName = req.body.foodName;
    // let calories = req.body.calories;

    //short form:
    let {foodName, calories} = req.body;

    //--------------------------------------------
    //Long Form, if key is same name as the variable
    await db.collection('food').insertOne({
        'foodName': foodName,
        'calories': calories
    });
    //short form 
    await db.collection('food').insertOne({
        foodName, calories
     });
     //------------------------------------------------
     

