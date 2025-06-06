
'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Home } from 'lucide-react';

const NotFound = () => {
    const router = useRouter();
    const [goBackAttempts, setGoBackAttempts] = useState(0);
    const [homeAttempts, setHomeAttempts] = useState(0);
    const [goBackGaveUp, setGoBackGaveUp] = useState(false);
    const [homeGaveUp, setHomeGaveUp] = useState(false);
    const [showMessage, setShowMessage] = useState(false);

    const goBackRef = useRef(null);
    const homeRef = useRef(null);
    const containerRef = useRef(null);

    const MAX_ATTEMPTS = 5;

    const handleGoBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push('/');
        }
    };

    const moveButtonRandomly = (buttonRef) => {
        if (!buttonRef.current || !containerRef.current) return;

        const container = containerRef.current;
        const button = buttonRef.current;

        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Get button dimensions
        const buttonRect = button.getBoundingClientRect();
        const buttonWidth = buttonRect.width;
        const buttonHeight = buttonRect.height;

        // Calculate safe boundaries with padding
        const padding = 20;
        const maxX = Math.max(padding, viewportWidth - buttonWidth - padding);
        const maxY = Math.max(padding, viewportHeight - buttonHeight - padding);

        // Generate random position within safe boundaries
        const randomX = Math.random() * (maxX - padding) + padding;
        const randomY = Math.random() * (maxY - padding) + padding;

        button.style.position = 'fixed';
        button.style.left = `${randomX}px`;
        button.style.top = `${randomY}px`;
        button.style.zIndex = '50';
    };

    const handlePlayfulClick = (buttonType) => {
        if (buttonType === 'goBack') {
            if (goBackGaveUp) {
                handleGoBack();
                return;
            }

            const newAttempts = goBackAttempts + 1;
            setGoBackAttempts(newAttempts);

            if (newAttempts >= MAX_ATTEMPTS) {
                setGoBackGaveUp(true);
                setShowMessage(true);
                if (goBackRef.current) {
                    goBackRef.current.style.position = 'static';
                    goBackRef.current.style.left = 'auto';
                    goBackRef.current.style.top = 'auto';
                }
                setTimeout(() => setShowMessage(false), 3000);
            } else {
                moveButtonRandomly(goBackRef);
            }
        } else if (buttonType === 'home') {
            if (homeGaveUp) {
                router.push('/');
                return;
            }

            const newAttempts = homeAttempts + 1;
            setHomeAttempts(newAttempts);

            if (newAttempts >= MAX_ATTEMPTS) {
                setHomeGaveUp(true);
                setShowMessage(true);
                if (homeRef.current) {
                    homeRef.current.style.position = 'static';
                    homeRef.current.style.left = 'auto';
                    homeRef.current.style.top = 'auto';
                }
                setTimeout(() => setShowMessage(false), 3000);
            } else {
                moveButtonRandomly(homeRef);
            }
        }
    };

    const handleMouseEnter = (buttonType) => {
        if (buttonType === 'goBack' && !goBackGaveUp && goBackAttempts < MAX_ATTEMPTS) {
            moveButtonRandomly(goBackRef);
        } else if (buttonType === 'home' && !homeGaveUp && homeAttempts < MAX_ATTEMPTS) {
            moveButtonRandomly(homeRef);
        }
    };

    useEffect(() => {
        // Reset button positions on component mount
        return () => {
            if (goBackRef.current) {
                goBackRef.current.style.position = 'static';
                goBackRef.current.style.left = 'auto';
                goBackRef.current.style.top = 'auto';
            }
            if (homeRef.current) {
                homeRef.current.style.position = 'static';
                homeRef.current.style.left = 'auto';
                homeRef.current.style.top = 'auto';
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div ref={containerRef} className="max-w-lg w-full text-center relative min-h-[600px]">
                {/* Error Code */}
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-orange-600 mb-4">404</h1>
                    <div className="w-24 h-1 bg-orange-600 mx-auto rounded-full"></div>
                </div>

                {/* Main Message */}
                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                        Page Under Maintenance
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        The page you requested is currently under maintenance and being updated 
                        to include the most recent content.
                    </p>
                </div>

                {/* Playful Message */}
                {showMessage && (
                    <div className="mb-6 p-4 bg-orange-100 border border-orange-300 rounded-lg animate-pulse">
                        <p className="text-orange-700 text-sm font-medium">
                            😅 Okay, I give up. I guess you're not willing to support today.
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center relative">
                    <button
                        ref={goBackRef}
                        onClick={() => handlePlayfulClick('goBack')}
                        onMouseEnter={() => handleMouseEnter('goBack')}
                        className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-orange-600 text-orange-600 font-medium rounded-lg transition-all duration-200 ${
                            goBackGaveUp 
                                ? 'hover:bg-orange-50 cursor-pointer' 
                                : 'hover:shadow-lg transform hover:scale-105 cursor-pointer select-none'
                        }`}
                        style={{ 
                            userSelect: 'none',
                            transition: goBackGaveUp ? 'all 0.2s ease' : 'all 0.3s ease'
                        }}
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        {goBackGaveUp ? 'Fine, Go Back' : 'Go Back'}
                    </button>

                    {process.env.NEXT_PUBLIC_SUPPORT_URL && (
                        <a
                            href={process.env.NEXT_PUBLIC_SUPPORT_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors duration-200"
                        >
                            <Heart size={20} className="mr-2" />
                            Support Us
                        </a>
                    )}

                    <button
                        ref={homeRef}
                        onClick={() => handlePlayfulClick('home')}
                        onMouseEnter={() => handleMouseEnter('home')}
                        className={`w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg transition-all duration-200 ${
                            homeGaveUp 
                                ? 'hover:bg-gray-700 cursor-pointer' 
                                : 'hover:shadow-lg transform hover:scale-105 cursor-pointer select-none'
                        }`}
                        style={{ 
                            userSelect: 'none',
                            transition: homeGaveUp ? 'all 0.2s ease' : 'all 0.3s ease'
                        }}
                    >
                        <Home size={20} className="mr-2" />
                        {homeGaveUp ? 'Okay, Take Me Home' : 'Home'}
                    </button>
                </div>

                {/* Support Message */}
                {process.env.NEXT_PUBLIC_SUPPORT_URL && (
                    <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border border-orange-200">
                        <p className="text-sm text-gray-600">
                            Help us maintain and improve our reptile community platform by supporting our work.
                        </p>
                    </div>
                )}

                {/* Decorative Elements */}
                <div className="mt-12 flex justify-center space-x-4 opacity-30">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                </div>

                {/* Hint Text */}
                {(goBackAttempts > 0 || homeAttempts > 0) && !goBackGaveUp && !homeGaveUp && (
                    <div className="mt-6 text-xs text-orange-500 opacity-75">
                        💡 Try clicking {MAX_ATTEMPTS - Math.max(goBackAttempts, homeAttempts)} more times...
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotFound;
