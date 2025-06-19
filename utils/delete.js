import connectDB from '../config/db.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

async function deleteAllPosts() {
    try {
        console.log('🔌 Connecting to database...');
        await connectDB();

        // Get current counts before deletion
        const postCount = await Post.countDocuments();
        const commentCount = await Comment.countDocuments();

        console.log(`📊 Current database status:`);
        console.log(`   📝 Posts: ${postCount}`);
        console.log(`   💬 Comments: ${commentCount}`);

        if (postCount === 0 && commentCount === 0) {
            console.log('\n✅ Database is already empty - nothing to delete!');
            return;
        }

        console.log('\n🗑️  Starting deletion process...');

        // Delete all comments first (since they reference posts)
        if (commentCount > 0) {
            const deletedComments = await Comment.deleteMany({});
            console.log(`   💬 Deleted ${deletedComments.deletedCount} comments`);
        }

        // Delete all posts
        if (postCount > 0) {
            const deletedPosts = await Post.deleteMany({});
            console.log(`   📝 Deleted ${deletedPosts.deletedCount} posts`);
        }

        // Verify deletion
        const remainingPosts = await Post.countDocuments();
        const remainingComments = await Comment.countDocuments();

        console.log('\n✅ Deletion completed successfully!');
        console.log(`📊 Final database status:`);
        console.log(`   📝 Posts remaining: ${remainingPosts}`);
        console.log(`   💬 Comments remaining: ${remainingComments}`);

        if (remainingPosts === 0 && remainingComments === 0) {
            console.log('\n🎉 Database is now completely clean!');
        } else {
            console.log('\n⚠️  Warning: Some items may not have been deleted');
        }

    } catch (error) {
        console.error('❌ Error deleting posts and comments:', error);
    } finally {
        // Close the database connection
        process.exit(0);
    }
}

// Run the script
deleteAllPosts();