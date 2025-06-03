
'use client';
import React, { useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { Image, X, Camera, Smile, MapPin } from 'lucide-react';

const CreatePost = ({ onPostCreated }) => {
    const { user, isSignedIn } = useUser();
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    if (!isSignedIn) {
        return null;
    }

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default'); // You'll need to set this up in Cloudinary

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/your-cloud-name/image/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim() && !imageFile) return;

        setIsLoading(true);

        try {
            let imageUrl = '';
            if (imageFile) {
                // For now, we'll use the preview URL, but in production you'd upload to Cloudinary
                imageUrl = imagePreview;
            }

            const response = await fetch('/api/feed/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content.trim(),
                    image: imageUrl,
                    author: {
                        userId: user.id,
                        name: user.fullName || user.firstName || 'Anonymous',
                        imageUrl: user.imageUrl
                    }
                }),
            });

            const data = await response.json();

            if (data.success) {
                setContent('');
                setImageFile(null);
                setImagePreview('');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                if (onPostCreated) {
                    onPostCreated(data.post);
                }
            } else {
                console.error('Failed to create post:', data.message);
            }
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border mb-4">
            <div className="p-4">
                <div className="flex items-start space-x-3">
                    <img
                        src={user.imageUrl}
                        alt={user.fullName || 'User'}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder={`What's on your mind, ${user.firstName || 'there'}?`}
                                className="w-full p-3 bg-gray-50 rounded-3xl resize-none focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 border-0 text-gray-900 placeholder-gray-500"
                                rows="2"
                                disabled={isLoading}
                                style={{ minHeight: '48px' }}
                            />

                            {imagePreview && (
                                <div className="mt-3 relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full max-h-96 rounded-lg object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white rounded-full p-1 hover:bg-opacity-90 transition-all"
                                        disabled={isLoading}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                                <div className="flex space-x-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageSelect}
                                        accept="image/*"
                                        className="hidden"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                                        disabled={isLoading}
                                    >
                                        <Camera size={20} className="text-green-500" />
                                        
                                    </button>
                                    <button
                                        type="button"
                                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                                        disabled={isLoading}
                                    >
                                        <Smile size={20} className="text-yellow-500" />

                                    </button>
                                    <button
                                        type="button"
                                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                                        disabled={isLoading}
                                    >
                                        <MapPin size={20} className="text-red-500" />

                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={(!content.trim() && !imageFile) || isLoading}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                >
                                    {isLoading ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
