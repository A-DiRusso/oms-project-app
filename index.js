require('dotenv').config();

const express = require('express');
const PORT =process.env.PORT;
const app = express();
const path = require('path');


const helmet = require('helmet');
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false}));
const es6Renderer = require('express-es6-template-engine');
app.engine('html', es6Renderer);
app.set('views','./views');
app.set('view engine','html');

const session = require('express-session');
const FileStore = require('session-file-store')(session);
const setupAuth = require('./auth');


const dashboardRouter = require('./routes/dashboard');
const loginRouter = require('./routes/login');
const signUpRouter = require('./routes/signup');

app.use(session( {
    store: new FileStore(),   //no options for now
    secret: process.env.SECRET    }      //just a random string to help encrypt
));


setupAuth(app);


app.use('/login', loginRouter);
app.use('/signup', signUpRouter);


app.use('/',dashboardRouter);

// app.all('*',(req, res) => {
//     res.render('index');
// })


app.listen(PORT,() => {
    console.log(`Server running on port: ${PORT}.`);
})