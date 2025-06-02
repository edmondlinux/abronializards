
import connectDB from '@/config/db';
import Blog from '@/models/Blog';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ 
                success: false, 
                message: 'Authentication required' 
            }, { status: 401 });
        }

        await connectDB();

        const { blogId, voteType } = await request.json();

        if (!blogId || !voteType || !['upvote', 'downvote'].includes(voteType)) {
            return NextResponse.json({ 
                success: false, 
                message: 'Invalid vote data' 
            }, { status: 400 });
        }

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return NextResponse.json({ 
                success: false, 
                message: 'Blog post not found' 
            }, { status: 404 });
        }

        // Check if user has already voted
        const existingVoteIndex = blog.voters.findIndex(voter => voter.userId === userId);
        let userVote = null;

        if (existingVoteIndex !== -1) {
            const existingVote = blog.voters[existingVoteIndex];

            if (existingVote.voteType === voteType) {
                // User is removing their vote
                blog.voters.splice(existingVoteIndex, 1);
                if (voteType === 'upvote') {
                    blog.upvotes = Math.max(0, blog.upvotes - 1);
                } else {
                    blog.downvotes = Math.max(0, blog.downvotes - 1);
                }
                userVote = null;
            } else {
                // User is changing their vote
                if (existingVote.voteType === 'upvote') {
                    blog.upvotes = Math.max(0, blog.upvotes - 1);
                    blog.downvotes += 1;
                } else {
                    blog.downvotes = Math.max(0, blog.downvotes - 1);
                    blog.upvotes += 1;
                }
                blog.voters[existingVoteIndex].voteType = voteType;
                userVote = voteType;
            }
        } else {
            // User is voting for the first time
            blog.voters.push({ userId, voteType });
            if (voteType === 'upvote') {
                blog.upvotes += 1;
            } else {
                blog.downvotes += 1;
            }
            userVote = voteType;
        }

        await blog.save();

        return NextResponse.json({ 
            success: true, 
            upvotes: blog.upvotes,
            downvotes: blog.downvotes,
            userVote
        });

    } catch (error) {
        console.error('Error handling vote:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Internal server error' 
        }, { status: 500 });
    }
}
