
import connectDB from '@/config/db';
import authSeller from '@/lib/authSeller';
import Blog from '@/models/Blog';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
    try {
        const { userId } = getAuth(request);

        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: 'Not authorized' });
        }

        await connectDB();

        const formData = await request.formData();
        const { id } = await params;

        const blogPost = await Blog.findById(id);
        if (!blogPost) {
            return NextResponse.json({ success: false, message: 'Blog post not found' });
        }

        // Check if the seller is the author of the blog post
        if (blogPost.author !== userId) {
            return NextResponse.json({ success: false, message: 'Not authorized to edit this post' });
        }

        const updateData = {
            title: formData.get('title'),
            slug: formData.get('slug'),
            content: formData.get('content'),
            excerpt: formData.get('excerpt'),
            category: formData.get('category'),
            reptileSpecies: formData.get('reptileSpecies'),
            metaDescription: formData.get('metaDescription'),
            careLevel: formData.get('careLevel'),
        };

        // Handle tags
        const tagsString = formData.get('tags');
        if (tagsString) {
            updateData.tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
        }

        // Handle featured image if provided
        const featuredImage = formData.get('featuredImage');
        if (featuredImage && featuredImage.size > 0) {
            // Convert file to base64 string for storage
            const bytes = await featuredImage.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const base64String = `data:${featuredImage.type};base64,${buffer.toString('base64')}`;
            updateData.featuredImage = base64String;
        }

        // Handle featuredImageUrl if provided (for cases where image URL is passed directly)
        const featuredImageUrl = formData.get('featuredImageUrl');
        if (featuredImageUrl) {
            updateData.featuredImage = featuredImageUrl;
        }

        const updatedBlogPost = await Blog.findByIdAndUpdate(id, updateData, { new: true });

        return NextResponse.json({ 
            success: true, 
            message: 'Blog post updated successfully',
            blogPost: updatedBlogPost
        });

    } catch (error) {
        console.error('Error updating blog post:', error);
        return NextResponse.json({ success: false, message: error.message });
    }
}
