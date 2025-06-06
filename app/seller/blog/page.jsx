'use client'
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import axios from "axios";
import toast from "react-hot-toast";
import dynamic from 'next/dynamic';

const CodeEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const BlogManagement = () => {
    const { router, getToken, user } = useAppContext();

    const [blogPosts, setBlogPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    // Form states
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [reptileSpecies, setReptileSpecies] = useState('');
    const [featuredImage, setFeaturedImage] = useState(null);
    const [metaDescription, setMetaDescription] = useState('');
    const [careLevel, setCareLevel] = useState('');

    const categories = [
        'Care Guides',
        'Species Profiles', 
        'Health & Veterinary',
        'Feeding & Nutrition',
        'Habitat Setup',
        'Breeding',
        'Beginner Tips',
        'Equipment Reviews'
    ];

    const careLevels = ['beginner', 'intermediate', 'advanced'];

    // Generate slug from title
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        setSlug(generateSlug(newTitle));
    };

    const fetchBlogPosts = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/blog/seller-list', { 
                headers: { Authorization: `Bearer ${token}` } 
            });

            if (data.success) {
                setBlogPosts(data.blogPosts);
                setLoading(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            setLoading(false);
        }
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setTitle(post.title);
        setSlug(post.slug);
        setContent(post.content);
        setExcerpt(post.excerpt);
        setCategory(post.category);
        setTags(post.tags.join(', '));
        setReptileSpecies(post.reptileSpecies || '');
        setMetaDescription(post.metaDescription || '');
        setCareLevel(post.careLevel || '');
        setShowEditForm(true);
        setShowCreateForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = await getToken();
            const formData = new FormData();

            formData.append('title', title);
            formData.append('slug', slug);
            formData.append('content', content);
            formData.append('excerpt', excerpt);
            formData.append('category', category);
            formData.append('tags', tags);
            formData.append('reptileSpecies', reptileSpecies);
            formData.append('metaDescription', metaDescription);
            formData.append('careLevel', careLevel);

            if (featuredImage) {
                formData.append('featuredImage', featuredImage);
            }

            const { data } = await axios.post('/api/blog/create', formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (data.success) {
                toast.success('Blog post created successfully!');
                setShowCreateForm(false);
                resetForm();
                fetchBlogPosts();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleSubmitEdit = async (e) => {
        e.preventDefault();

        try {
            const token = await getToken();
            const formData = new FormData();

            formData.append('title', title);
            formData.append('slug', slug);
            formData.append('content', content);
            formData.append('excerpt', excerpt);
            formData.append('category', category);
            formData.append('tags', tags);
            formData.append('reptileSpecies', reptileSpecies);
            formData.append('metaDescription', metaDescription);
            formData.append('careLevel', careLevel);

            if (featuredImage) {
                formData.append('featuredImage', featuredImage);
            }

            const { data } = await axios.put(`/api/blog/edit/${editingPost._id}`, formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (data.success) {
                toast.success('Blog post updated successfully!');
                setShowEditForm(false);
                setEditingPost(null);
                resetForm();
                fetchBlogPosts();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;

        try {
            const token = await getToken();
            const { data } = await axios.delete(`/api/blog/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                toast.success('Blog post deleted successfully!');
                fetchBlogPosts();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const resetForm = () => {
        setTitle('');
        setSlug('');
        setContent('');
        setExcerpt('');
        setCategory('');
        setTags('');
        setReptileSpecies('');
        setFeaturedImage(null);
        setMetaDescription('');
        setCareLevel('');
    };

    useEffect(() => {
        if (user) {
            fetchBlogPosts();
        }
    }, [user]);

    return (
        <div className="flex-1 min-h-screen flex flex-col justify-between">
            {loading ? <Loading /> : (
                <div className="w-full md:p-10 p-4">
                    <div className="flex justify-between items-center pb-4">
                        <h2 className="text-lg font-medium">Blog Management</h2>
                        <div className="flex gap-2">
                            {(showCreateForm || showEditForm) && (
                                <button 
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        setShowEditForm(false);
                                        setEditingPost(null);
                                        resetForm();
                                    }}
                                    className="px-6 py-2 bg-gray-600 text-white font-medium rounded hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                            )}
                            <button 
                                onClick={() => {
                                    setShowCreateForm(!showCreateForm);
                                    setShowEditForm(false);
                                    setEditingPost(null);
                                    resetForm();
                                }}
                                className="px-6 py-2 bg-orange-600 text-white font-medium rounded hover:bg-orange-700"
                            >
                                {showCreateForm ? 'Cancel' : 'Create New Post'}
                            </button>
                        </div>
                    </div>

                    {showCreateForm && (
                        <div className="mb-8 p-6 border rounded-lg bg-gray-50">
                            <h3 className="text-lg font-medium mb-4">Create New Blog Post</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={handleTitleChange}
                                            className="w-full outline-none py-2 px-3 rounded border border-gray-300"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Slug</label>
                                        <input
                                            type="text"
                                            value={slug}
                                            onChange={(e) => setSlug(e.target.value)}
                                            className="w-full outline-none py-2 px-3 rounded border border-gray-300"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Excerpt</label>
                                    <textarea
                                        value={excerpt}
                                        onChange={(e) => setExcerpt(e.target.value)}
                                        rows="2"
                                        className="w-full outline-none py-2 px-3 rounded border border-gray-300"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Content (HTML)</label>
                                    <CodeEditor
                                        value={content}
                                        onChange={setContent}
                                        language="html"
                                        height="400px"
                                        placeholder="Enter HTML content, e.g., <p>Taking care of abronia has never been easy</p>"
                                        className="mt-1"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Category</label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full outline-none py-2 px-3 rounded border border-gray-300"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Care Level</label>
                                        <select
                                            value={careLevel}
                                            onChange={(e) => setCareLevel(e.target.value)}
                                            className="w-full outline-none py-2 px-3 rounded border border-gray-300"
                                        >
                                            <option value="">Select Care Level</option>
                                            {careLevels.map((level) => (
                                                <option key={level} value={level}>{level}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Reptile Species</label>
                                        <input
                                            type="text"
                                            value={reptileSpecies}
                                            onChange={(e) => setReptileSpecies(e.target.value)}
                                            placeholder="e.g., bearded-dragon"
                                            className="w-full outline-none py-2 px-3 rounded border border-gray-300"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="heating, lighting, substrate"
                                        className="w-full outline-none py-2 px-3 rounded border border-gray-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Meta Description</label>
                                    <textarea
                                        value={metaDescription}
                                        onChange={(e) => setMetaDescription(e.target.value)}
                                        rows="2"
                                        className="w-full outline-none py-2 px-3 rounded border border-gray-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Featured Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setFeaturedImage(e.target.files[0])}
                                        className="w-full outline-none py-2 px-3 rounded border border-gray-300"
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded hover:bg-orange-700"
                                >
                                    Create Blog Post
                                </button>
                            </form>
                        </div>
                    )}

                    {showEditForm && editingPost && (
                        <div className="mb-8 p-6 border rounded-lg bg-blue-50">
                            <h3 className="text-lg font-medium mb-4">Edit Blog Post</h3>
                            <form onSubmit={handleSubmitEdit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={handleTitleChange}
                                            className="w-full outline-none py-2 px-3 rounded border border-gray-300"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Slug</label>
                                        <input
                                            type="text"
                                            value={slug}
                                            onChange={(e) => setSlug(e.target.value)}
                                            className="w-full outline-none py-2 px-3 rounded border border-gray-300"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Excerpt</label>
                                    <textarea
                                        value={excerpt}
                                        onChange={(e) => setExcerpt(e.target.value)}
                                        rows="2"
                                        className="w-full outline-none py-2 px-3 rounded border border-gray-300"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Content (HTML)</label>
                                    <CodeEditor
                                        value={content}
                                        onChange={setContent}
                                        language="html"
                                        height="400px"
                                        placeholder="Enter HTML content, e.g., <p>Taking care of abronia has never been easy</p>"
                                        className="mt-1"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Category</label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full outline-none py-2 px-3 rounded border border-gray-300"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Care Level</label>
                                        <select
                                            value={careLevel}
                                            onChange={(e) => setCareLevel(e.target.value)}
                                            className="w-full outline-none py-2 px-3 rounded border border-gray-300"
                                        >
                                            <option value="">Select Care Level</option>
                                            {careLevels.map((level) => (
                                                <option key={level} value={level}>{level}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Reptile Species</label>
                                        <input
                                            type="text"
                                            value={reptileSpecies}
                                            onChange={(e) => setReptileSpecies(e.target.value)}
                                            placeholder="e.g., bearded-dragon"
                                            className="w-full outline-none py-2 px-3 rounded border border-gray-300"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="heating, lighting, substrate"
                                        className="w-full outline-none py-2 px-3 rounded border border-gray-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Meta Description</label>
                                    <textarea
                                        value={metaDescription}
                                        onChange={(e) => setMetaDescription(e.target.value)}
                                        rows="2"
                                        className="w-full outline-none py-2 px-3 rounded border border-gray-300"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Featured Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setFeaturedImage(e.target.files[0])}
                                        className="w-full outline-none py-2 px-3 rounded border border-gray-300"
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    className="px-8 py-2.5 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
                                >
                                    Update Blog Post
                                </button>
                            </form>
                        </div>
                    )}

                    <div className="flex flex-col items-center max-w-6xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                        <table className="table-fixed w-full overflow-hidden">
                            <thead className="text-gray-900 text-sm text-left">
                                <tr>
                                    <th className="w-2/5 px-4 py-3 font-medium">Title</th>
                                    <th className="px-4 py-3 font-medium max-sm:hidden">Category</th>
                                    <th className="px-4 py-3 font-medium max-sm:hidden">Published</th>
                                    <th className="px-4 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogPosts.map((post, index) => (
                                    <tr key={index} className="border-t border-gray-300/50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {post.featuredImage && (
                                                    <Image
                                                        src={post.featuredImage}
                                                        width={50}
                                                        height={50}
                                                        alt={post.title}
                                                        className="rounded object-cover"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-medium truncate">{post.title}</p>
                                                    <p className="text-xs text-gray-500 truncate">{post.excerpt}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 max-sm:hidden">{post.category}</td>
                                        <td className="px-4 py-3 max-sm:hidden">
                                            {new Date(post.publishDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(post)}
                                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post._id)}
                                                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
};

export default BlogManagement;