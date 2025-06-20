import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BlogListClient from '@/app/blog/BlogListClient';

async function fetchBlogPosts(page = 1) {
  const params = new URLSearchParams({ page: page.toString(), limit: '9' });
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/blog/list?${params}`, {
    cache: 'no-store', // ensures fresh data
  });
  if (!res.ok) throw new Error('Failed to fetch blog posts');
  return res.json();
}

export default async function BlogListPage() {
  const data = await fetchBlogPosts();

  return (
    <>
      <Navbar />
      <BlogListClient
        initialBlogPosts={data.blogPosts}
        initialPagination={data.pagination}
      />
      <Footer />
    </>
  );
}
