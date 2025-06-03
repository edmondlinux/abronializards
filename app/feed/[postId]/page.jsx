
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

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yoursite.com';

        return {
            title: `${post.author.name} - Community Post`,
            description,
            keywords: 'community, social media, feed, post, discussion',
            robots: {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    'max-video-preview': -1,
                    'max-image-preview': 'large',
                    'max-snippet': -1,
                },
            },
            openGraph: {
                title: `${post.author.name} - Community Post`,
                description,
                type: 'article',
                url: `${baseUrl}/feed/post/${resolvedParams.postId}`,
                images: post.image ? [
                    {
                        url: post.image,
                        width: 1200,
                        height: 630,
                        alt: 'Post image',
                    }
                ] : [
                    {
                        url: `${baseUrl}/api/og/post?id=${resolvedParams.postId}`,
                        width: 1200,
                        height: 630,
                        alt: description,
                    }
                ],
                publishedTime: post.createdAt,
                authors: [post.author.name],
                locale: 'en_US',
                siteName: 'Community Feed',
            },
            twitter: {
                card: 'summary_large_image',
                title: `${post.author.name} - Community Post`,
                description,
                images: post.image ? [post.image] : [`${baseUrl}/api/og/post?id=${resolvedParams.postId}`],
                creator: '@yourhandle',
            },
            alternates: {
                canonical: `${baseUrl}/feed/post/${resolvedParams.postId}`,
            }
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Community Post',
            description: 'View this post on our community feed.'
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
