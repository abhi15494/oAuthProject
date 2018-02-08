const mongoose = require("mongoose");

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
    }
});

var user = mongoose.model("users", userSchema);

module.exports = user;