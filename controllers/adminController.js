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
            res.send("all");
    },
    submitPosts: (req, res) => {
        res.send("submitted");
    },
    createPostsGet: (req, res) => {
        res.send("created");
    }
}