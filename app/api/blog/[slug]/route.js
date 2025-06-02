import connectDB from '@/config/db';
import Blog from '@/models/Blog';
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(request, { params }) {
    try {
        await connectDB();

        const { userId } = getAuth(request);
        const { slug } = await params;

        const blogPost = await Blog.findOne({ 
            slug: slug, 
            isPublished: true 
        }).select('-author');

        if (!blogPost) {
            return NextResponse.json({ 
                success: false, 
                message: 'Blog post not found' 
            });
        }

        const blogPostObj = blogPost.toObject();

        // Add user vote information if user is authenticated
        if (userId) {
            const userVoteRecord = blogPost.voters.find(voter => voter.userId === userId);
            blogPostObj.userVote = userVoteRecord ? userVoteRecord.voteType : null;
        }

        // Remove voters array from response for privacy
        delete blogPostObj.voters;

        return NextResponse.json({ 
            success: true, 
            blogPost: blogPostObj 
        });

    } catch (error) {
        console.error('Error fetching blog post:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
}