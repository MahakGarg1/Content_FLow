const Post = require('../models/PostModel');
const express = require('express');
const session = require('express-session');

module.exports = {

    index: (req, res) => {
        res.render('admin/index');

    },
    /* ADMIN POSTS ENDPOINTS */


    getPosts: (req, res) => {
       /* Post.find()
            .populate('category')
            .then(posts => {
                res.render('admin/posts/index', {posts: posts});
            }); */
            res.render('admin/posts/index');
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
                description
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
    }
}