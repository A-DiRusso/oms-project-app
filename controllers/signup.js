const User = require('../models/users');

async function  createNewUser(req, res) {
    console.log('--------------')
    console.log(req.body);
    console.log('--------------')
    const newUser = await User.getByEmail(req.body.email);
    console.log('before function user')
        console.log(newUser);
        console.log('--------------')
    
    if (!newUser.companyEmail) {
        const newPassword = User.hashPassword(req.body.password);
        await User.insertUser(req.body.email, newPassword, req.body.firstname, req.body.lastname);
        console.log('no user email')
        console.log(newUser.companyEmail);
        console.log('--------------')
        
        req.session.email = req.body.email;
        req.session.save( async () => {
            res.render('login', {
                locals:{
                    message: "Signup Successful. Please Log in.",
                    email: req.session.email
                }})
                res.redirect('/login');
            }
        )

    } else if (newUser.companyEmail) { 
        console.log('yes user email')
        console.log(newUser.companyEmail);
        console.log('--------------')
        res.render('login', {
            locals: {
                message: 'Looks like we know each other. Please log in.', 
                email: req.body.email
            }})
        res.redirect('/login')
    }  
}

function showSignUp(req, res) {
    res.render('signup', {locals: {message: "Sign up here"}});
}

module.exports = {createNewUser, showSignUp};