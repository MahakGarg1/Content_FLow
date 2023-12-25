const Post = require('../models/PostModel');
const express = require('express');
const session = require('express-session');
const Category = require('../models/CategoryModel');
const {isEmpty} = require('../config/customFunctions');

module.exports = {

    index: (req, res) => {
        res.render('admin/index');

    },
    /* ADMIN POSTS ENDPOINTS */


    getPosts: (req, res) => {
        Post.find().lean()
           .populate('category')
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
          // Check for any input file
         let filename = '';
          //console.log(req.file);   
          
          if(!isEmpty(req.files)) {
            let file = req.files.uploadedFile;
            filename = file.name;
            let uploadDir = './public/uploads/';
            
            file.mv(uploadDir+filename, (err) => {
                if (err)
                    throw err;
            });
        }
         
          const { title, status, description, category } = req.body;
            
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
                commentsAllowed,
                category,
                file: `/uploads/${filename}`

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
        Category.find().lean().then(cats => {

            res.render('admin/posts/create', {categories: cats});
        });

    },
    editPost : (req, res) => {
        const id = req.params.id;

        Post.findById(id).lean()
            .then(post => {

                Category.find().lean().then(cats => {
                    res.render('admin/posts/edit', {post: post, categories: cats});
                });


            })
    },
       editPostSubmit: (req, res) => {
        // Convert req.body.allowComments to a boolean
        const allowComments = req.body.allowComments === 'on';
    
        const id = req.params.id;
    
        Post.findById(id)
            .then(post => {
                // Update post fields
                post.title = req.body.title;
                post.status = req.body.status;
                post.allowComments = allowComments; // Use the converted boolean value
                post.description = req.body.description;
                post.category = req.body.category;
    
                // Save the updated post
                post.save().then(updatePost => {
                    req.flash('success-message', `The Post ${updatePost.title} has been updated.`);
                    res.redirect('/admin/posts');
                })
                .catch(error => {
                    console.error(error);
                    res.status(500).send('Internal Server Error');
                });
            })
            .catch(error => {
                console.error(error);
                res.status(500).send('Internal Server Error');
            });
    },
    
        
    deletePost: (req, res) => {

        Post.findByIdAndDelete(req.params.id)
            .then(deletedPost => {
                req.flash('success-message', `The post ${deletedPost.title} has been deleted.`);
                res.redirect('/admin/posts');
            });
    },
    /* ALL CATEGORY METHODS*/
    getCategories: (req, res) => {

        Category.find().lean().then(cats => {
            res.render('admin/category/index', {categories: cats});
        });
    },
        createCategories: async (req, res) => {
            try {     console.log('Received category creation request:', req.body);
                const categoryName = req.body.title;
        
                if (!categoryName) {
                    req.flash('error-message', 'Category title is required.');
                    res.redirect('/admin/category'); // Redirect to the category page
                    return;
                }
        
                const newCategory = new Category({
                    title: categoryName
                });
        
                const savedCategory = await newCategory.save();
                console.log('Category created successfully:', savedCategory);

                req.flash('success-message', 'Category created successfully.');
                res.redirect('/admin/category'); // Redirect to the category page
            } catch (error) {
                console.error('Error creating category:', error);
                req.flash('error-message', 'Error creating category.');
                res.redirect('/admin/category'); // Redirect to the category page
            }
        },

        editCategoriesGetRoute: async (req, res) => {
            const catId = req.params.id;
    
            const cats = await Category.find().lean();
    
    
            Category.findById(catId).lean().then(cat => {
    
                res.render('admin/category/edit', {category: cat, categories: cats});
    
            });
        },
       
        editCategoriesPostRoute: (req, res) => {
            const catId = req.params.id;
            const newTitle = req.body.title;
            console.log('Received data:', catId, newTitle);
        
            if (newTitle) {
                Category.findById(catId).then(category => {
                    category.title = newTitle;
        
                    category.save().then(updated => {
                        res.redirect( '/admin/category' );
                    });
                }).catch(error => {
                    console.error(error);
                    res.status(500).json({ error: 'Internal Server Error' });
                });
            }
        }
        

    }

