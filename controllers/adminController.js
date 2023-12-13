const Post = require('../models/PostModel');
const express = require('express');
const session = require('express-session');

module.exports = {

    index: (req, res) => {
        res.render('admin/index');

    },
    /* ADMIN POSTS ENDPOINTS */


    getPosts: (req, res) => {
        Post.find().lean()
           // .populate('category')
            .then(posts => {
                res.render('admin/posts/index', {posts: posts});
            });
            
        },   
   
    
    
    /* submitPosts : async (req, res) => {
        try {
            console.log(req.body);
    
            // Check if title and description are present in the request body
           if (!req.body.title || !req.body.description) {
                req.flash('error-message', 'Title and description are required.');
                res.redirect('/admin/posts');
                return;
            } 
    
            const newPost = new Post({
                title: req.body.title,
                status: req.body.status,
                description: req.body.description
            });
           //console.log(req.body);
    
            const savedPost = await newPost.save();
            console.log(savedPost);
    
            req.flash('success-message', 'Post created successfully.');
            res.redirect('/admin/posts');
        } catch (error) {
            console.error(error);
            req.flash('error-message', 'Error creating post.');
            res.redirect('/admin/posts');
        }
    }, */
    

    submitPosts : async (req, res) => {
        try {
            console.log(req.body); // Log the form data
            
        const commentsAllowed = req.body.allowComments ? true : false;
        
           const { title, status, description } = req.body;
           
            // Check if title and description are present in the request body
            if (!title || !description) {
                req.flash('error-message', 'Title and description are required.');
                res.redirect('/admin/posts');
                return;
            }
            
            const newPost = new Post({
                title,
                status,
                description,
                commentsAllowed
            });
            console.log(newPost); // Log the new post object
        
            const savedPost = await newPost.save();
            console.log(savedPost); // Log the saved post object
        
            req.flash('success-message', 'Post created successfully.');
            res.redirect('/admin/posts');
        } catch (error) {
            console.error(error);
            req.flash('error-message', 'Error creating post.');
            res.redirect('/admin/posts');
        }
     },
    createPostsGet: (req, res) => {
        res.render('admin/posts/create');
    },
    editPost : (req, res) => {
        const id = req.params.id;
        Post.findById(id).lean().then( Post => {
        res.render('admin/posts/edit',{Post : Post});
        });
    },
 /*   editPostUpdateRoute: (req, res) => {
        const commentsAllowed = req.body.allowComments ? true : false;


        const id = req.params.id;

        Post.findById(id).lean()
            .then(post => {

                post.title = req.body.title;
                post.status = req.body.status;
                post.allowComments = req.body.allowComments;
                post.description = req.body.description;
               // post.category = req.body.category;


                post.save().then(updatePost => {
                    req.flash('success-message', `The Post ${updatePost.title} has been updated.`);
                    res.redirect('/admin/posts');

                });
            });

    } */
    deletePost: (req, res) => {

        Post.findByIdAndDelete(req.params.id)
            .then(deletedPost => {
                req.flash('success-message', `The post ${deletedPost.title} has been deleted.`);
                res.redirect('/admin/posts');
            });
    }

}