const { getUsers, getUserPosts } = require('./apiService');

const getTopUsers = async (limit = 5) => {
    try {
        console.log('Starting to fetch users...');
        // Get all users
        const usersResponse = await getUsers();
        
        console.log('Users response:', usersResponse);
        
        if (!usersResponse || !usersResponse.users) {
            throw new Error('Invalid users response format');
        }

        const users = usersResponse.users;
        console.log('Found users:', users);

        // Get posts for each user
        const userPostCounts = new Map();
        
        // Process each user's posts
        for (const [userId, userName] of Object.entries(users)) {
            console.log(`Fetching posts for user ${userId}...`);
            try {
                const postsResponse = await getUserPosts(userId);
                console.log(`Posts for user ${userId}:`, postsResponse);
                
                if (!postsResponse || !Array.isArray(postsResponse.posts)) {
                    console.warn(`Invalid posts response for user ${userId}`);
                    continue;
                }

                const postCount = postsResponse.posts.length;
                userPostCounts.set(userId, {
                    userId,
                    userName,
                    postCount
                });
            } catch (error) {
                console.error(`Error fetching posts for user ${userId}:`, error);
                // Continue with other users even if one fails
                continue;
            }
        }

        // Sort by post count and get top users
        const result = Array.from(userPostCounts.values())
            .sort((a, b) => b.postCount - a.postCount)
            .slice(0, limit);

        console.log('Final result:', result);
        return result;
    } catch (error) {
        console.error('Error in getTopUsers:', {
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });
        throw error;
    }
};

module.exports = {
    getTopUsers
}; 