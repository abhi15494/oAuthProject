const localStrategy = require("passport-local").Strategy;
const passport = require("passport");
const User = require("../app/models/user");
const configAuth = require("./auth");
const fbstrategy = require("passport-facebook");
const googlestrategy = require("passport-google-oauth").OAuth2Strategy;

module.exports = function(passport){
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

    passport.use(new fbstrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callBackURL
    }, function(accessToken, refreshToken, profile, done){
        process.nextTick(function(){
            User.findOne({'facebook.id': profile.id}, function(err, uesr){
                if (err) return done(err);
                if (user) return done(null, user);
                else{
                    var newuser = new User();
                    newuser.facebook.id = progile.id;
                    newuser.facebook.token = accessToken;
                    newuser.facebook.name = profile.name.givenName + " " + profile.name.familyName;
                    newuser.facebook.email = profile.emails[0].value;

                    newuser.save(function(err){
                        if (err) throw err;
                        return done(null, newuser);
                    });
                    console.log(profile);
                }
            });
        });
    }));

    passport.use(new googlestrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callBackURL
    }, function(accessToken, refreshToken, profile, done){
        process.nextTick(function(){
            User.findOne({'google.id': profile.id}, function(err, uesr){
                if (err) return done(err);
                if (user) return done(null, user);
                else{
                    var newuser = new User();
                    newuser.google.id = profile.id;
                    newuser.google.token = accessToken;
                    newuser.google.name = profile.displayname;
                    newuser.google.email = profile.emails[0].value;

                    newuser.save(function(err){
                        if (err) throw err;
                        return done(null, newuser);
                    });
                    console.log(profile);
                }
            });
        });
    }));
};