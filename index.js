const express = require("express");
const port = process.env.port || 4000;
const app = express();

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoose = require("mongoose");

const passport = require("passport");
const flash = require("connect-flash");

const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({extended: false}));

app.set("view engine", "ejs");
const configdb = require("./config/database");

mongoose.connect(configdb.url, ()=>{
    console.log("---> Mongo Database Connected");
});

require("./config/passport")(passport);

app.use("/static", express.static("static"));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(session({
    // Keycode for what is used in your string
    secret : "OAuthAppSecretTextForSession",
    // When you save session in your database and user get presistant login
    saveUninitialized : true,
    // When nothing changed  the cookie saved
    resave : true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// app.use("/", function(req, res){
//     res.send("Our first program");
//     console.log(req.cookies);
//     console.log("----------------------------------");
//     console.log(req.session);
// });

const routes = require("./app/routes")(app, passport);
app.listen(port, ()=> {
    console.log("App is running at - " + port);
});