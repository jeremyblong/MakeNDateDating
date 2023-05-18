const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const { Connection } = require("../../mongoUtil.js");
const { 
    decryptString
} = require("../../crypto.js");


// Called during login/sign up.
passport.use("users", new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true 
}, (req, email, password, done) => {
    console.log("req, email, password, done", req, email, password, done);

    const collection = Connection.db.db("test").collection("users");

    collection.findOne({ email: email.trim().toLowerCase() }).then((user) => {
        console.log("user", user);
        if (!user) {
            return done(null, false, { message: 'Error - a problem occurred...' });
        } else {
            if ((email.trim().toLowerCase() === user.email) && (password === decryptString(user.password))) {
                return done(null, user, req);
            } else {
                return done(null, false, { message: "User could NOT be authenticated - make sure you're using a valid email & password combination." })
            }
        }
    }).catch((err) => {
        console.log(err.message);

        return done(err);
    })
}));
// called while after logging in / signing up to set user details in req.user
passport.serializeUser((user, done) => {
    done(null, user._id);
});