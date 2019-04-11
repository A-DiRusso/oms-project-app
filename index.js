require('dotenv').config();

const express = require('express');
const PORT =process.env.PORT;
const app = express();
const path = require('path');


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

app.use(session( {
    store: new FileStore(),   //no options for now
    secret: process.env.SECRET    }      //just a random string to help encrypt
));

setupAuth(app);

app.use(express.static(path.join(__dirname, 'public')));


app.use('/',dashboardRouter);
app.use('/login', loginRouter)


app.listen(PORT,() => {
    console.log(`Server running on port: ${PORT}.`);
})