const User = require('../models/users');

function showLoginPage (req, res) {
    res.render('login',{
        locals:{
            email:'',
            message:''
            
    }});
}

async function verifyUser(req, res) {
    //get the email from the post body
    const theUser = await User.getByEmail(req.body.email);
    const enteredPassword = req.body.password;

    if (theUser && await User.checkPassword(enteredPassword)) {
        req.session.user = theUser;
        // res.render('login', {
        //     locals: {
        //         message: 'Success'
        //     }
        // })
        res.redirect('/');
    } else if (theUser.message) {
        res.render('login', {
            locals: {
                message: 'Your username does not exist in the system'
            }
        })
    } else if (theUser.checkPassword(enteredPassword) === false) {
        res.render('login', {
            locals: {
                message: 'Password is not correct. Please try again'
            }
        })
        

    }
};
//     //set session email
//         console.log(theUser);
//         //if the user not found, redirect to the signup page
//         if (theUser === null) {
//             res.redirect('/signup');
//         }
//             //if the user exists, check password
//             if (theUser.checkPassword(req.body.password)) {
                
//                 //get the list of stores for that user
//                 // const userStores = await theUser.allStores();  //get a list of stores
//                 // console.log("The user stores are", userStores);
                

//                 //store the store array in session
//                 // req.session.stores = userStores;
//                 // req.session.user=theUser.firstName;
//                 // req.session.userID = theUser.id;
                

//                 // req.session.userObject = theUser;


//                 // req.session.save( () => {
                    
//                 //     res.render('main',{locals:{user:theUser.firstName,storeName:null,storeid:null,stores:userStores,items:[]}});


//                 // })
//             } else {//wrong password
//                 await theUser.setPassword(req.body.password);
//                 console.log("saved the password");
//                 await theUser.save();
//                 console.log("updated the db");
//         console.log("incorrct password");
//         // send the form back to them, but with the email already filled out for them
//                 res.render('login',{
//                     locals:{
//                         email:req.body.email, 
//                         message:"password incorrect. please try again"}});  //this will be a Get
    
//         }
//     });
// }






module.exports =  {showLoginPage, verifyUser} ;


