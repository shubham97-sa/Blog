var express=require("express");
var app= express();
var methodoverride=require("method-override");
var expressSanitizer=require("express-sanitizer");
var mongoose=require("mongoose");
var bodyparser=require("body-parser");
//APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app" , {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodoverride("_method"));
//MONGOOSE/MODEL CONFIG
var blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{type:Date,default:Date.now}
});
//title
//image
//body
//created
var Blog=mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES
app.get("/", function(req,res){
    res.redirect("/blogs")
});
//INDEX ROUTE
app.get("/blogs", function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log("Errorr!!")
        }else{
            res.render("index",{blogs:blogs})
        }
    })
    
});
//NEW ROUTE
app.get("/blogs/new", function(req,res){
    res.render("new")
})
//CREATE ROUTE
app.post("/blogs", function(req,res){
    //create a blog 
    req.body.blog.body=req.sanitize(req.body.blog.body);

    Blog.create(req.body.blog, function(err,newblog){
        if(err){
            res.render("new")

        }else{
             //redirect to index
            res.redirect("/blogs")
        }
    })
   
});
//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id, function(err,foundblog){
        if(err){
            res.redirect("/blogs")
        }else{
            res.render("show", {blog:foundblog})
        }
    })
})
//EDIT ROUTE
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect("/blogs")
        }else{
            res.render("edit",{blog:foundblog});
        }
    })
    
});
//UPDATE ROUTE
app.put("/blogs/:id", function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
        if(err){
            res.redirect("/blogs")
        }else{
            res.redirect("/blogs/" + req.params.id);
        }
    })
});
//DELETE ROUTE
app.delete("/blogs/:id", function(req,res){
    //DESTROY BLOG
    Blog.findByIdAndRemove(req.params.id ,function(err){
        if(err){
            res.redirect("/blogs")
        }else{
            //REDIRECT SOMEWHERE
            res.redirect("/blogs")
        }
    })
    
   
})
app.listen(3020, function(){
    console.log("Server Is Running!!!");
});