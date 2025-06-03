import React, { useState, useRef } from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';

const ProductCard = ({ product }) => {
    const { currency } = useAppContext()
    const [showPreview, setShowPreview] = useState(false)
    const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 })
    const timeoutRef = useRef(null)
    const productUrl = `/product/${product.slug || product._id}`
    const fullUrl = `${window.location.origin}${productUrl}`

    const handleMouseEnter = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setPreviewPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10
        })

        timeoutRef.current = setTimeout(() => {
            setShowPreview(true)
        }, 800) // Show preview after 800ms of hover
    }

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        setShowPreview(false)
    }

    const handleHeartClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log('Added to wishlist:', product.name)
    }

    const handleBuyNowClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log('Buy now clicked:', product.name)
    }

    const copyLink = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        try {
            await navigator.clipboard.writeText(fullUrl)
            // You could add a toast notification here
            console.log('Link copied:', fullUrl)
        } catch (err) {
            console.error('Failed to copy link:', err)
        }
    }

    return (
        <>
            <Link
                href={productUrl}
                className="flex flex-col items-start gap-1 max-w-[200px] w-full block no-underline"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                scroll={false}
            >
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl w-full h-52 flex items-center justify-center overflow-hidden shadow-sm">
                    <Image
                        src={product.image[0]}
                        alt={product.name}
                        className="object-cover w-4/5 h-4/5 md:w-full md:h-full rounded-lg"
                        width={800}
                        height={800}
                    />
                    <button 
                        onClick={handleHeartClick}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg transition-all duration-200"
                        aria-label="Add to wishlist"
                    >
                        <Image
                            className="h-3.5 w-3.5"
                            src={assets.heart_icon}
                            alt="heart_icon"
                        />
                    </button>
                </div>

                <div className="w-full space-y-1 pt-1">
                    <p className="md:text-base font-semibold text-gray-800 w-full truncate leading-tight">{product.name}</p>
                    <p className="w-full text-xs text-gray-600 max-sm:hidden truncate leading-relaxed">{product.description}</p>

                    <div className="flex items-center gap-2 py-0.5">
                        <p className="text-xs font-medium text-gray-700">{4.5}</p>
                        <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Image
                                    key={index}
                                    className="h-3 w-3"
                                    src={
                                        index < Math.floor(4)
                                            ? assets.star_icon
                                            : assets.star_dull_icon
                                    }
                                    alt="star_icon"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex items-end justify-between w-full mt-2">
                        <p className="text-base font-bold text-gray-900">{currency}{product.offerPrice}</p>
                        <button 
                            onClick={handleBuyNowClick}
                            className="max-sm:hidden px-4 py-1.5 text-gray-700 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium shadow-sm"
                        >
                            Buy now
                        </button>
                    </div>
                </div>
            </Link>

            {/* Link Preview Tooltip */}
            {showPreview && (
                <div 
                    className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-xl max-w-xs"
                    style={{
                        left: previewPosition.x,
                        top: previewPosition.y,
                        transform: 'translate(-50%, -100%)'
                    }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Image
                            src={product.image[0]}
                            alt={product.name}
                            className="w-8 h-8 rounded object-cover"
                            width={32}
                            height={32}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <p className="text-xs text-gray-300">{currency}{product.offerPrice}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-300 border-t border-gray-700 pt-2">
                        <span className="truncate flex-1">{fullUrl}</span>
                        <button
                            onClick={copyLink}
                            className="px-2 py-1 bg-gray-700 rounded text-white hover:bg-gray-600 transition-colors flex-shrink-0"
                        >
                            Copy
                        </button>
                    </div>

                    {/* Arrow pointing down */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ProductCard