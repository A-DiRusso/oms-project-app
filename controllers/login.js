const User = require('../models/users');

function showLoginPage (req, res) {
    res.render('login',{
        locals:{
            email:'',
            message:''
            
    }});
}


async function verifyUser(req, res) {
    //set session email
    console.log('req.body.password login.js/9:', req.body.password);
    req.session.email = req.body.email;
    req.session.username = req.body.username;

    req.session.save( async () => { 
        //get the email from the post body
        const theUser = await User.getByEmail(`${req.body.email}`);

        //if the user not found, redirect to the signup page
        if (theUser === null) {
            res.redirect('/signup');
        } else {
            res.redirect('/');

        }
    });    
}

module.exports =  {showLoginPage, verifyUser} ;


