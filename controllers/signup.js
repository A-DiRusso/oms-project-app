const User = require('../models/users');

async function  createNewUser(req, res) {
    console.log(req.body);
    const newUser = await User.getByEmail(req.body.email);
    if (newUser === null) {
        const newPassword = User.hashPassword(req.body.password);
        await User.insertUser(req.body.email, newPassword, req.body.firstname, req.body.lastname);
        // await User.insertUser(req.body.firstname, req.body.lastname, req.body.email, newPassword);
//save email to session
        req.session.email = req.body.email;
        req.session.save( async () => {
            res.render('login',{
                locals:{
                    message: "Please Log in",
                    email: req.session.email}})
        })
        res.redirect('/');


    } else { //send them to login with email filled
        res.render('login', {locals: {message: 'Looks like we know each other, please log in', email:req.body.email}})
    }
     

    
}

function showSignUp(req, res) {
    res.render('signup', {locals: {message: "Sign up here"}});
}

module.exports = {createNewUser, showSignUp};