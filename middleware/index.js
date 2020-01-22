var Campground = require("../models/campground");
var Comment = require("../models/comment");
//all the middleware functions go here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error","Campground not found!");
				res.redirect("back");
			} else{
				// does user own the campground?
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				} else{
					req.flash("error"," You do not have permission to do that.");
					res.redirect("back");
				}
			}
		});
	}else{
		req.flash("error", "You need to logged in first!");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		// console.log(req.params.comment_id);
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
			   req.flash("error", "Comment not found");
               res.redirect("back");
			   console.log(err);
           }  else {
               // does user own the comment?
			   // console.log(req.user._id);
				// console.log("&&&&&&&&&&&&&&&&&&");
				// console.log(foundComment);
				// console.log(typeof foundComment);
				// console.log(foundComment.author.id);
				// console.log(typeof foundComment.author.id);
				if(foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error"," You do not have permission to do that.");
					res.redirect("back");
				}
           }
        });
    } else {
		feq.flash("error", "You need to logged in first!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn= function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "Please Login First!");
	res.redirect("/login");
}

module.exports = middlewareObj;