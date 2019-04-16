const User = require('../models/users');
const Passport = require('../auth');

function showLoginPage (req, res) {
    req.session.destroy(() => {
        res.render('login',{
            locals:{
                email:'',
                message:''
                
        }});
    });

}


async function verifyUser(req, res) {
    //set session email
    // console.log('req.body.password login.js/9:', req.body.password);
    req.session.email = req.body.email;
    // req.session.username = req.body.username;

    //get the email from the post body
    const theUser = await User.getByEmail(`${req.body.email}`);
    // console.log('this is theUser:', theUser);
    // res.send('this is working');

    //if the user not found, redirect to the signup page
    if (theUser.password || Passport.req.isAuthenticated()) {
        req.session.save(() => {
            res.redirect('/');
        })
        
    } else {
        res.render('login', {
            locals: {
                message:'User name or password is incorrect.',
                email: ""
            }
        });

    }
        
}

module.exports =  {showLoginPage, verifyUser};


