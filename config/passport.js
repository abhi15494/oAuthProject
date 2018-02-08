var localStrategy = require("passport-local").Strategy;
const passport = require("passport");
var User = require("../app/models/user");

module.exports = (passport)=>{
    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err,user){
            done(err, user);
        });
    });

    passport.use('local-signup', new localStrategy({
        usernameField : "username",
        passwordField : "password",
        passReqToCallback: true
    },(req, username, password, done)=>{
        process.nextTick(()=>{
            User.findOne({"local.username": username}, (err, user)=>{
                if (err) return done(err);
                if (user) return done(null, false, req.flash("signupMessage", "Email Already Taken"));
                else{
                    var newuser = new User();
                    newuser.local.username = username;
                    newuser.local.password = newuser.generateHash(password);

                    newuser.save((err)=>{
                        if (err) throw err;
                        return done(null, newuser);
                    });
                }
            });
        });
    }));

    passport.use('local-login', new localStrategy({
        usernameField : "username",
        passwordField : "password",
        passReqToCallback : true
    },(req, username, password, done)=> {
        process.nextTick(()=>{
            User.findOne({"local.username" : username}, (err, user)=>{
                if (err) return done(err);
                if (!user) return done(null, false, req.flash("loginMessage", "User not Found"));
                if (!user.validatePassword(password)) return done(null, false, req.flash("loginMessage", "Invalid Password"));
                return done(null, user);
            });
        });
    }));
};