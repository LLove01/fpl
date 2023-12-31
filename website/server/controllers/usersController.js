var UsersModel = require('../models/usersModel.js');
const axios = require('axios');
const BASE_URL = "https://fantasy.premierleague.com/api/";

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
        UsersModel.authenticate(req.body.username, req.body.password, async function (error, user) {
            if (error || !user) {
                res.status(401).json({"error" : "Wrong username or password"});
                return;
            } else {
                console.log(user.competitorsIds.length)
                let competirorsIds = user.competitorsIds;
                let competitorsNamesAndIds = [];
                for (let i = 0; i < competirorsIds.length; i++) {
                    const responseManagerData = await axios.get(`${BASE_URL}entry/${competirorsIds[i]}`);

                    const firstName = responseManagerData.data.player_first_name;
                    const lastName = responseManagerData.data.player_last_name;
                    const competetorId = competirorsIds[i];

                    competitorsNamesAndIds.push({name: firstName + " " + lastName, id: competetorId})
                }                
                return res.status(200).json({"username" : user.username, "managerId" : user.managerId, competitors: competitorsNamesAndIds});
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
        var managerId = req.params.id;
        console.log(managerId)
        UsersModel.findOne({managerId: managerId}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting users',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such users'
                });
            }

            let comptetitorId = parseInt(req.body.competirorsIds);
            let competitors = user.competitorsIds;

            const includes = competitors.includes(comptetitorId)
            if (!includes || competitors.length == 0) {
                user.username = req.body.username ? req.body.username : user.username;
                user.password = req.body.password ? req.body.password : user.password;
                user.managerId = req.body.managerId? req.body.managerId: user.managerId;
                user.competirorsIds = req.body.competirorsIds ? competitors.push(comptetitorId) : user.competirorsIds;
                user.save(async function (err, user) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating users.',
                            error: err
                        });
                    }
                    const responseManagerData = await axios.get(`${BASE_URL}entry/${comptetitorId}`);
                    const firstName = responseManagerData.data.player_first_name;
                    const lastName = responseManagerData.data.player_last_name;
                    return res.status(200).json({name: firstName + " " + lastName});
                });
                
            } else {
                return res.json("object already in array!");
            }
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
