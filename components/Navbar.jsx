"use client"
import React, { useState } from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { isSeller, router, user } = useAppContext();
  const { openSignIn } = useClerk()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-4 border-b border-gray-200 bg-white shadow-sm relative">
        <Image
          className="cursor-pointer w-28 md:w-32 hover:scale-105 transition-transform duration-300"
          onClick={() => router.push('/')}
          src={assets.logo}
          alt="logo"
        />

        {/* Desktop Navigation Links */}
        <div className="flex items-center gap-2 lg:gap-4 max-md:hidden">
          <Link 
            href="/" 
            className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-all duration-300 rounded-lg hover:bg-emerald-50 group"
          >
            <span className="relative z-10">Home</span>
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></span>
          </Link>
          <Link 
            href="/all-products" 
            className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-all duration-300 rounded-lg hover:bg-emerald-50 group"
          >
            <span className="relative z-10">Shop</span>
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></span>
          </Link>
          <Link 
            href="/blog" 
            className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-all duration-300 rounded-lg hover:bg-emerald-50 group"
          >
            <span className="relative z-10">Blog</span>
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></span>
          </Link>
          <Link 
            href="/about" 
            className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-all duration-300 rounded-lg hover:bg-emerald-50 group"
          >
            <span className="relative z-10">About Us</span>
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></span>
          </Link>
          <Link 
            href="/contact" 
            className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-all duration-300 rounded-lg hover:bg-emerald-50 group"
          >
            <span className="relative z-10">Contact</span>
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></span>
          </Link>
          <Link 
            href="/feed" 
            className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-all duration-300 rounded-lg hover:bg-emerald-50 group"
          >
            <span className="relative z-10">Community</span>
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></span>
          </Link>
          <Link 
            href="/testimonials" 
            className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-all duration-300 rounded-lg hover:bg-emerald-50 group"
          >
            <span className="relative z-10">Testimonials</span>
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></span>
          </Link>
          {isSeller && 
            <button 
              onClick={() => router.push('/seller')} 
              className="relative px-4 py-2 text-xs font-semibold text-emerald-700 border-2 border-emerald-200 bg-emerald-50 rounded-full hover:bg-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all duration-300 group"
            >
              <span className="relative z-10">Seller Dashboard</span>
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 rounded-full transition-opacity duration-300"></span>
            </button>
          }
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative group">
            <Image 
              className="w-5 h-5 cursor-pointer opacity-60 hover:opacity-100 transition-opacity duration-300 hover:scale-110 transform" 
              src={assets.search_icon} 
              alt="search icon" 
            />
            <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-20 rounded-full blur-sm transition-opacity duration-300"></div>
          </div>
          {
            user
              ? <div className="relative">
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-9 h-9 hover:shadow-lg transition-shadow duration-300 ring-2 ring-emerald-100 hover:ring-emerald-200",
                        userButtonPopoverCard: "shadow-xl border border-gray-100",
                        userButtonPopoverActionButton: "hover:bg-emerald-50 transition-colors duration-200"
                      }
                    }}
                  >
                    <UserButton.MenuItems>
                      <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push('/cart')} />
                    </UserButton.MenuItems>
                    <UserButton.MenuItems>
                      <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push('/my-orders')} />
                    </UserButton.MenuItems>
                  </UserButton>
                </div>
              : <div className="flex items-center gap-3">
                  <button 
                    onClick={() => router.push('/blog')} 
                    className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-all duration-300 rounded-lg hover:bg-emerald-50 group"
                  >
                    <span className="relative z-10">Blog</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></span>
                  </button>
                  <button 
                    onClick={openSignIn} 
                    className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 group overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <Image className="relative z-10 w-4 h-4 brightness-0 invert" src={assets.user_icon} alt="user icon" />
                    <span className="relative z-10">Sign In</span>
                  </button>
                </div>
          }
        </div>

        {/* Mobile Right Side with Hamburger */}
        <div className="flex items-center md:hidden gap-2">
          {isSeller && 
            <button 
              onClick={() => router.push('/seller')} 
              className="relative px-3 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200 bg-emerald-50 rounded-full hover:bg-emerald-100 hover:border-emerald-300 hover:shadow-sm transition-all duration-300 group"
            >
              <span className="relative z-10">Seller</span>
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-5 rounded-full transition-opacity duration-300"></span>
            </button>
          }

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="relative w-8 h-8 flex flex-col justify-center items-center gap-1.5 hover:bg-emerald-50 rounded-lg transition-all duration-300 group"
            aria-label="Toggle menu"
          >
            <span className={`w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-5 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
            <button
              onClick={closeMobileMenu}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Close menu"
            >
              <span className="w-5 h-0.5 bg-gray-700 rotate-45 absolute"></span>
              <span className="w-5 h-0.5 bg-gray-700 -rotate-45 absolute"></span>
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-4 space-y-2">
              {/* Navigation Links */}
              <Link 
                href="/"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 group"
              >
                <HomeIcon className="w-5 h-5" />
                <span className="font-medium">Home</span>
              </Link>

              <Link 
                href="/all-products"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 group"
              >
                <BoxIcon className="w-5 h-5" />
                <span className="font-medium">Shop</span>
              </Link>

              <Link 
                href="/blog"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 group"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <span className="font-medium">Blog</span>
              </Link>

              <Link 
                href="/about"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 group"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">About Us</span>
              </Link>

              <Link 
                href="/contact"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 group"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">Contact</span>
              </Link>

              <Link 
                href="/feed"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 group"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-medium">Community</span>
              </Link>
               <Link 
                href="/testimonials"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 group"
              >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                <span className="font-medium">Testimonials</span>
              </Link>

              {/* User-specific links */}
              {user && (
                <>
                  <div className="border-t border-gray-200 my-4"></div>
                  <button 
                    onClick={() => {
                      router.push('/cart');
                      closeMobileMenu();
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 group"
                  >
                    <CartIcon className="w-5 h-5" />
                    <span className="font-medium">Cart</span>
                  </button>

                  <button 
                    onClick={() => {
                      router.push('/my-orders');
                      closeMobileMenu();
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 group"
                  >
                    <BagIcon className="w-5 h-5" />
                    <span className="font-medium">My Orders</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-6 border-t border-gray-200">
            {user ? (
              <div className="flex items-center gap-3">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 ring-2 ring-emerald-100",
                    }
                  }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">Signed in</p>
                  <p className="text-xs text-gray-500">Manage account in profile</p>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => {
                  openSignIn();
                  closeMobileMenu();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <Image className="w-4 h-4 brightness-0 invert" src={assets.user_icon} alt="user icon" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;