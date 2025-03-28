let posts = [];

const updatePosts = (newPosts) => {
    posts = newPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const getLatestPosts = (limit = 5) => {
    return posts.slice(0, limit);
};

const getPopularPosts = () => {
    const maxComments = Math.max(...posts.map(post => post.comments.length));
    return posts.filter(post => post.comments.length === maxComments);
};

module.exports = {
    updatePosts,
    getLatestPosts,
    getPopularPosts
}; 