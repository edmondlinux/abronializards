import connectDB from '@/config/db';
import Blog from '@/models/Blog';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

export async function GET(request, { params }) {
    try {
        await connectDB();

        const { userId } = auth();

        const blogPost = await Blog.findOne({ 
            slug: params.slug, 
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