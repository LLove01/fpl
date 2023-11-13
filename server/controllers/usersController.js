var UsersModel = require('../models/usersModel.js');

/**
 * usersController.js
 *
 * @description :: Server-side logic for managing userss.
 */
module.exports = {

    /**
     * usersController.list()
     */
    list: function (req, res) {
        UsersModel.find(function (err, userss) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting users.',
                    error: err
                });
            }

            return res.json(userss);
        });
    },

    /**
     * usersController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        UsersModel.findOne({_id: id}, function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting users.',
                    error: err
                });
            }

            if (!users) {
                return res.status(404).json({
                    message: 'No such users'
                });
            }

            return res.json(users);
        });
    },

    login: function (req, res) {
        UsersModel.authenticate(req.body.username, req.body.password, function (error, user) {
            if (error || !user) {
                res.status(401).json({"error" : "Wrong username or password"});
                return;
            } else {
                res.status(200).json({"username" : user.username, "managerId" : user.managerId});
            }
        });
    },

    logout: function (req, res) {
        if (req.session) {
            req.session.destroy(function (error) {
                if (error) {
                    return next(error);
                } else {
                    return res.status(201).json({});
                }
            });
        }
    },

    /**
     * usersController.create()
     */
    create: function (req, res) {
        var users = new UsersModel({
			username : req.body.username,
			password : req.body.password,
			managerId : req.body.managerId
        });

        users.save(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating users',
                    error: err
                });
            }

            return res.status(201).json({
                "username" : users.username,
                "managerId" : users.managerId
            });
        });
    },

    /**
     * usersController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        UsersModel.findOne({_id: id}, function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting users',
                    error: err
                });
            }

            if (!users) {
                return res.status(404).json({
                    message: 'No such users'
                });
            }

            users.username = req.body.username ? req.body.username : users.username;
			users.password = req.body.password ? req.body.password : users.password;
			users.managerId = req.body.managerId ? req.body.managerId : users.managerId;
			
            users.save(function (err, users) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating users.',
                        error: err
                    });
                }

                return res.json(users);
            });
        });
    },

    /**
     * usersController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UsersModel.findByIdAndRemove(id, function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the users.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
