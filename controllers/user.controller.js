const User = require("../models/user.model");

exports.create = function(req, res){
    let user = new User(
        {
            username: req.body.username,
            password: req.body.password
        }
    );

    user.save(function (err) {
        if (err)
        {
            res.send("Error");
        }
        else
        {
            res.send('User created successfully');
        }
    })
};

exports.details = function(req, res){
    User.findById(req.params.id, (err, user) => {
        if (err)
            res.send(err);
        else
            res.send(user);
    })
};

exports.update = function(req, res){
    User.findByIdAndUpdate(req.params.id, {$set: req.body},(err, user) => {
        if (err)
            res.send(err);
        else
            res.send(user);
    })
};

exports.delete = function(req, res){
    User.findByIdAndDelete(req.params.id, (err) => {
        if (err)
            res.send(err);
        else
            res.send("User Deleted with ID:" + req.params.id);
    })
}