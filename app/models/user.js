const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    local: {
        username: {
            type: String,
            unique : true,
            required: true,
            trim: true
        },
        password: {
            type: String,
            unique : true,
            required: true,
            trim: true
        }
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});

userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

userSchema.methods.validatePassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
}

var user = mongoose.model("users", userSchema);

module.exports = user;