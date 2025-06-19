
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";

const GiveawayModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(48 * 60 * 60); // 48 hours in seconds

  useEffect(() => {
    // Check if user has already seen/entered the giveaway
    const hasSeenGiveaway = localStorage.getItem('abronia_giveaway_seen');
    const hasEnteredGiveaway = localStorage.getItem('abronia_giveaway_entered');
    
    if (hasSeenGiveaway || hasEnteredGiveaway) {
      return;
    }

    let timeoutId;
    let scrollTriggered = false;
    let exitTriggered = false;

    // Timer trigger (30 seconds)
    const timerTrigger = () => {
      if (!scrollTriggered && !exitTriggered) {
        setIsVisible(true);
        localStorage.setItem('abronia_giveaway_seen', 'true');
      }
    };

    // Scroll trigger (50% of page)
    const handleScroll = () => {
      if (scrollTriggered) return;
      
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent >= 50) {
        scrollTriggered = true;
        clearTimeout(timeoutId);
        setIsVisible(true);
        localStorage.setItem('abronia_giveaway_seen', 'true');
      }
    };

    // Exit intent trigger
    const handleMouseLeave = (e) => {
      if (exitTriggered) return;
      
      if (e.clientY <= 0) {
        exitTriggered = true;
        clearTimeout(timeoutId);
        setIsVisible(true);
        localStorage.setItem('abronia_giveaway_seen', 'true');
      }
    };

    // Set up triggers
    timeoutId = setTimeout(timerTrigger, 30000); // 30 seconds
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/giveaway/enter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          source: 'giveaway_modal'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setMessage(data.message);
        localStorage.setItem('abronia_giveaway_entered', 'true');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsVisible(false);
    localStorage.setItem('abronia_giveaway_seen', 'true');
  };

  const shareGiveaway = () => {
    const shareText = "🎉 Win a rare Abronia lizard! Check out this amazing giveaway from Abronia Lizards!";
    const shareUrl = window.location.origin;
    
    if (navigator.share) {
      navigator.share({
        title: 'Abronia Lizard Giveaway',
        text: shareText,
        url: shareUrl,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Share link copied to clipboard!');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-pulse-scale">
        {!submitted ? (
          <div className="p-6">
            {/* Close button */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                GIVEAWAY ALERT!
              </h2>
              <h3 className="text-lg font-semibold text-emerald-600 mb-3">
                Win a Rare Abronia Lizard!
              </h3>
              
              {/* Countdown */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 font-semibold text-sm">
                  ⏰ Giveaway ends in: {formatTime(timeLeft)}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4 mb-6">
              <p className="text-gray-700 text-sm leading-relaxed">
                We recently had a clutch of Abronia lizards and from the lots of support we've been getting, 
                we'd like to give back to our amazing community!
              </p>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h4 className="font-semibold text-emerald-800 mb-2">🦎 What You Can Win:</h4>
                <ul className="text-sm text-emerald-700 space-y-1">
                  <li>• Abronia Graminea (Green Arboreal Alligator Lizard)</li>
                  <li>• Abronia Taeniata (Guatemalan Arboreal Lizard)</li>
                  <li>• Abronia Mixteca (Mixtec Arboreal Lizard)</li>
                  <li>• Abronia Oaxacae (Oaxacan Arboreal Lizard)</li>
                </ul>
              </div>

              <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center">
                  <span className="text-emerald-500 mr-1">✓</span>
                  <span>FREE Entry</span>
                </div>
                <div className="flex items-center">
                  <span className="text-emerald-500 mr-1">✓</span>
                  <span>Ethically Bred</span>
                </div>
                <div className="flex items-center">
                  <span className="text-emerald-500 mr-1">✓</span>
                  <span>Expert Care Support</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-4 md:h-16 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
                  required
                  disabled={loading}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Entering...' : '🎯 Enter Giveaway FREE'}
              </button>
            </form>

            {message && (
              <p className={`mt-3 text-sm text-center ${message.includes('success') ? 'text-emerald-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-xs text-gray-500">
                No purchase necessary. Winners will be contacted via email.
              </p>
            </div>
          </div>
        ) : (
          /* Thank You Page */
          <div className="p-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              You're In!
            </h2>
            <p className="text-gray-700 mb-6">
              Thanks for entering! We'll contact you via email if you win one of our beautiful Abronia lizards.
            </p>

            {/* Share for extra entries */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-yellow-800 mb-2">🚀 Get 2 Extra Entries!</h3>
              <p className="text-sm text-yellow-700 mb-3">
                Share this giveaway with friends for 2 bonus entries!
              </p>
              <button 
                onClick={shareGiveaway}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors text-sm font-semibold"
              >
                📱 Share Giveaway
              </button>
            </div>

            {/* Engagement */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                While you wait, explore our care guides and shop:
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <a 
                  href="/abronia-care-sheet" 
                  className="flex-1 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium"
                >
                  📚 Care Guides
                </a>
                <a 
                  href="/shop" 
                  className="flex-1 bg-teal-100 text-teal-700 px-4 py-2 rounded-lg hover:bg-teal-200 transition-colors text-sm font-medium"
                >
                  🛒 Shop Now
                </a>
              </div>
            </div>

            <button 
              onClick={closeModal}
              className="mt-6 text-gray-500 hover:text-gray-700 text-sm"
            >
              Continue browsing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiveawayModal;
