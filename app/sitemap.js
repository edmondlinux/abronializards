import connectDB from '@/config/db';
import Product from '@/models/Product';
import Blog from '@/models/Blog';
import Post from '@/models/Post';

export default async function sitemap() {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_SITE_URL || 'https://abronializards.com'
    : 'http://localhost:3000';

  try {
    await connectDB();

    // Get all products
    const products = await Product.find({ status: 'active' }).select('_id slug updatedAt').lean();
    
    // Get all blog posts
    const blogs = await Blog.find({ status: 'published' }).select('slug updatedAt').lean();
    
    // Get all feed posts
    const posts = await Post.find().select('_id updatedAt').lean();

    const staticPages = [
      {
        url: baseUrl,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/about`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/blog`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/all-products`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/feed`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/testimonials`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.7,
      },
    ];

    const productPages = products.map((product) => ({
      url: `${baseUrl}/product/${product._id}`,
      lastmod: product.updatedAt?.toISOString() || new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
    }));

    const blogPages = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastmod: blog.updatedAt?.toISOString() || new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.8,
    }));

    const feedPages = posts.map((post) => ({
      url: `${baseUrl}/feed/post/${post._id}`,
      lastmod: post.updatedAt?.toISOString() || new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.6,
    }));

    return [...staticPages, ...productPages, ...blogPages, ...feedPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [
      {
        url: baseUrl,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 1,
      },
    ];
  }
}
