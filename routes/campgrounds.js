var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middlewareObj = require("../middleware");


router.get("/",function(req, res){
	Campground.find({},function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("./campgrounds/campgrounds", {campgrounds : allCampgrounds});
		}
	});
});

router.post("/",middlewareObj.isLoggedIn,function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name:name,price: price,image:image, description:desc, author: author};
	// campgrounds.push(newCampground);
	Campground.create(newCampground,function(err ,newlyCreated){
		if(err){
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
});

router.get("/new",function(req,res){
	res.render("./campgrounds/new");
});

router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            // console.log(foundCampground);
            //render show template with that campground
            res.render("./campgrounds/show", {campground: foundCampground});
        }
    });
});


//edit campground route
router.get("/:id/edit", middlewareObj.checkCampgroundOwnership,function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit",{campground: foundCampground});
		
	});
});

router.put("/:id",middlewareObj.checkCampgroundOwnership,function(req, res){
	//find an update the correct campgrounds
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updateCampground){
		
			res.redirect("/campgrounds/" + req.params.id);
		
	});
});

//destroy campground route
router.delete("/:id",middlewareObj.checkCampgroundOwnership,function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		
			res.redirect("/campgrounds");
		
	});
});




module.exports = router;