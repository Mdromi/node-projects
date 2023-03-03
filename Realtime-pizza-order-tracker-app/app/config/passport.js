const User = require('../models/user');
const bcrypt = require('bcrypt');

const LocalStrategy = require('passport-local').Strategy

const init = (passport) => {
    passport.use(new LocalStrategy({usernameField: 'email'}, async(email, password, done) => {
        // Login
        // check if email exits
        const user = await User.findOne({email: email});

        if(!user)  return done(null, false, {message: 'No user with this mails'});

        try {
           const match =  bcrypt.compare(password, user.password);
           if(match) return done(null, user, {message: 'Logged in successfully'});

           return done(null, false, {message: 'Wrong username or password'});
        } catch (err) {
            return done(null, false, {message: 'Something want wrong'});
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id)
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })

}

module.exports = init