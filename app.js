var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
    Campground = require("./models/campground.js"),
	Comment = require("./models/comment.js"),
	User = require("./models/user.js"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	flash = require("connect-flash"),
    seedDB = require("./seeds");

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

// mongoose.connect("mongodb+srv://q426wang:yu1228096@yelpcamp-n4nyj.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true})
//     .then(success => console.log(success))
//  .catch(error => console.log(error));

var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp_v12";
mongoose.connect(url, {useUnifiedTopology: true,useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret : "Once again Rusty wins cutest dog!",
	resave: false,
	saveUnitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// seedDB();

app.use(function(req, res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});
