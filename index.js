
require('dotenv').config();
const express = require('express');
const PORT =process.env.PORT;
const app = express();

const es6Renderer = require('express-es6-template-engine');
app.engine('html', es6Renderer);
app.set('views','./views');
app.set('view engine','html');

const session = require('express-session');
const FileStore = require('session-file-store')(session);
const dashboardRouter = require('./routes/dashboard');

app.use(session( {
    store: new FileStore(),   //no options for now
    secret: process.env.SECRET    }      //just a random string to help encrypt
));




app.use('/',dashboardRouter);


app.listen(PORT,() => {
    console.log(`Server running on port: ${PORT}.`);
})