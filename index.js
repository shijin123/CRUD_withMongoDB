const express = require('express');
const bodyParser = require('body-parser');

const getUsers = async(req,res) =>{
    const {User} = require('./models/user.js');
    const {keyword} = req.query;
    let user;
    if(req.query.keyword != undefined){
        const filteresUser = await User.find({
            name: {
                $regex: keyword,
                $options: 'i'
            }
        });
        user = filteresUser;

    }
    else{
        user = await User.find();
    }
    
    res.send(user);
}

const addUser = async (req, res) => {
    const {User} = require('./models/user.js');
    const user = await User.create(req.body);
    res.send(user);
}

const editUser = async (req, res) => {
    const {User} = require('./models/user.js');
    const user = await User.updateOne(
        {_id: req.params.id},
        {$set: {name: req.body.name, profileImage: req.body.profileImage, status: req.body.status}}
    );
    res.send(user);
}

const deleteUser = async (req, res) => {
    const {User} = require('./models/user.js');
    const user = await User.remove({_id: req.params.id});
    res.send("User Deleted successfully");
}

async function startServer(){
    const app = express();
    app.use(bodyParser.json());

    app.listen(3000, error=> {
        if(error) {
            console.log('Error initialising app', error);
        }
        console.log('App listening on port: 3000');
    })
    app.get('/users', getUsers);
    app.post('/users', addUser);
    app.put('/users/:id', editUser);
    app.delete('/users/:id', deleteUser);

}

startServer();