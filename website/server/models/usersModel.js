var mongoose = require('mongoose');
var bcrypt = require('bcrypt')
var Schema   = mongoose.Schema;

var usersSchema = new Schema({
	'username' : String,
	'password' : String,
	'managerId' : Number,
	'competitorsIds' : Array
});

usersSchema.statics.authenticate = function(username, password, callback) {
	User.findOne({ username: username }).exec(function(error, user) {
		if (error) {
			return callback(error);
		} else if (!user) {
			var err = new Error("User not found!");
			err.status = 401;
			return callback(err);
		}
		bcrypt.compare(password, user.password, function(error, result) {
			if (result === true) {
				return callback(null, user);
			} else {
				return callback();
			}
		});
	});
}

//before we save user to database this function will be called
usersSchema.pre('save', function(next) {
	var user = this;
	if(user.password.length<10){
		bcrypt.hash(user.password, 10, function(error, hash) {
			if (error) {
				return next(error);
			}
			user.password = hash;
			next();
		});
	}else{
		next();
	}
});

var User = mongoose.model('users', usersSchema);
module.exports = User;
