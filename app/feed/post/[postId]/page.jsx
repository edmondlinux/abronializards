
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import connectDB from '@/config/db';
import Post from '@/models/Post';
import PostDetailClient from './PostDetailClient';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
    try {
        await connectDB();
        const resolvedParams = await params;
        const post = await Post.findById(resolvedParams.postId).lean();

        if (!post) {
            return {
                title: 'Post Not Found',
                description: 'The requested post could not be found.'
            };
        }

        const description = post.content.length > 160 
            ? post.content.substring(0, 160) + '...'
            : post.content;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://abronializards.com';

        return {
            title: `${post.title || 'Community Post'} | Abronia Lizards`,
            description,
            robots: 'index, follow',
            openGraph: {
                title: post.title || 'Community Post',
                description,
                type: 'article',
                url: `${baseUrl}/feed/post/${resolvedParams.postId}`,
                images: post.images || [],
            },
            twitter: {
                card: 'summary_large_image',
                title: post.title || 'Community Post',
                description,
                images: post.images || [],
            },
            alternates: {
                canonical: `/feed/post/${resolvedParams.postId}`,
            }
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Post Not Found',
            description: 'The requested post could not be found.',
            robots: 'noindex, nofollow'
        };
    }
}

async function getPost(postId) {
    try {
        await connectDB();
        const post = await Post.findById(postId).lean();

        if (!post) {
            return null;
        }

        return JSON.parse(JSON.stringify(post));
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

export default async function PostDetailPage({ params }) {
    const resolvedParams = await params;
    const post = await getPost(resolvedParams.postId);

    if (!post) {
        notFound();
    }

    // Generate structured data for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SocialMediaPosting",
        "headline": `Post by ${post.author.name}`,
        "text": post.content,
        "author": {
            "@type": "Person",
            "name": post.author.name,
            "image": post.author.imageUrl
        },
        "datePublished": post.createdAt,
        "dateModified": post.updatedAt,
        "interactionStatistic": [
            {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/LikeAction",
                "userInteractionCount": post.likes || 0
            },
            {
                "@type": "InteractionCounter",
                "interactionType": "https://schema.org/CommentAction",
                "userInteractionCount": post.commentCount || 0
            }
        ]
    };

    if (post.image) {
        structuredData.image = post.image;
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData)
                }}
            />
            <Suspense fallback={
                <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                </div>
            }>
                <PostDetailClient post={post} />
            </Suspense>
        </>
    );
}
