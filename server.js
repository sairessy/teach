const express = require('express');
const app = express();
var cookieParser = require('cookie-parser');
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser())
const port = process.env.PORT || 3000;
app.listen(port, ()=> {
    console.log('Listening on port ' + port);
});

const User = require('./src/User');
const Data = require('./src/Data');
const { json } = require('express');

// 
app.post('/trylogin', async (req, res)=> {
    const response = await new User().login(req.body);
    if(response.length > 0) {
        var cookie = req.cookies.cookieName;
        if (cookie === undefined) {
            // no: set a new cookie
            var randomNumber=Math.random().toString();
            randomNumber=randomNumber.substring(2,randomNumber.length);
            res.cookie('sessionId', response[0]._id, { maxAge: 900000, httpOnly: true });
            console.log('cookie created successfully');
        } else {
            // yes, cookie was already present 
            console.log('cookie exists', cookie);
        } 
        // next(); // <-- important!
    }
    
    res.json({sucess: response.length > 0});
});

// Update user info
app.post('/updateUserInfo', (req, res) => {
    var id = req.cookies.sessionId;
    const response = new User().update(req.body, id);
});

// 
app.post('/updateDisciplinas', (req, res)=> {
    const data = req.body;
    const userId = req.cookies.sessionId;
    new User().updateDisciplinas(data, userId);
    res.end();
});

// Register user
app.post('/register', (req, res) => {
    const response = new User().register(req.body);
    res.json({sucess: response});
});

// API
app.get('/login', (req, res)=> {
    var cookie = req.cookies.sessionId;
    if(cookie === undefined) {
        res.sendFile(__dirname + '/public/' + 'login.html');
    } else {
        res.sendFile(__dirname + '/public/' + 'dashboard.html');
    }
});

app.get('/signup', (req, res)=> {
    var cookie = req.cookies.sessionId;
    if(cookie === undefined) {
        res.sendFile(__dirname + '/public/' + 'signup.html');
    } else {
        res.sendFile(__dirname + '/public/' + 'dashboard.html');
    }
});

app.get('/dashboard', (req, res)=> {
    var cookie = req.cookies.sessionId;
    if(cookie === undefined) {
        res.sendFile(__dirname + '/public/' + 'login.html');
    } else {
        res.sendFile(__dirname + '/public/' + 'dashboard.html');
    }
});

app.get('/passwordrecovery', (req, res) => {
    res.sendFile(__dirname + '/public/' + 'password-recovery.html');
});

app.get('/recoverypassword/:id', (req, res) => {
    const id = req.params['id'];
    console.log(id);
    res.sendFile(__dirname + '/public/' + 'password-recovery-success.html');
});

app.get('/profile', (req, res)=> {
    res.sendFile(__dirname + '/public/' + 'profile.html');
});

app.get('/logout', (req, res)=> {
    // Destroy user session
    res.cookie('sessionId', '', { maxAge: 0, httpOnly: true });
    res.sendFile(__dirname + '/public/' + 'login.html');
});

app.post('/removeDisciplina', (req, res)=> {
    const itemId = req.body.itemId;
    const userId = req.cookies.sessionId;
    new User().removeDisciplina(userId, itemId);
    res.end();
});

app.post('/users', async (req, res) => {
    const response = await new User().getUsers();
    res.json(response);
});

app.post('/user', async (req, res)=> {
    userId = req.cookies.sessionId;
    const response = await new User().getUser(userId);
    res.json(response);
});

// Get disciplinas of the user
app.post('/disciplinas', async (req, res) => {
    const userId = req.cookies.sessionId;
    const response = await new User().getDisciplinas(userId);
    res.json(response);
});

// Get user photo
app.get('/userPhoto', async (req, res)=> {
    const userId = req.cookies.sessionId;
    const response = await new User().getPhoto(userId);
    res.json({url: response});
});

// Authendication
app.get('/auth', (req, res)=> {
    res.json({yeh: req.cookies.sessionId != undefined});
});


// update photo url
app.post('/updatePhotoUrl', async (req, res) => {
    const userId = req.cookies.sessionId;
    const photo = req.body.url;
    new User().updatePhoto(userId, photo);
});

// GET PUBLIC INFO
app.get('/publicDisciplinas/:user', async (req, res)=> {
    const userId = req.params['user'];
    console.log(userId);
    const response = await new User().getDisciplinas(userId);
    console.log(response);
    res.json(response);
});

app.post('/publicUserInfo', async (req, res)=> {
    const userId = req.body.user;
    const response = await new User().getUser(userId);
    console.log(response);
    res.json(response);
});

app.post('/searchUsers', async (req, res) => {
    const response = await new Data().searchUsers(req.body);
    res.json(response);
});

app.get('/userId', (req, res) => {
    res.json({id: req.cookies.sessionId});
});