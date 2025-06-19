
'use client';
import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({ error, reset }) {
    return (
        <html>
            <body>
                <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                    <div className="max-w-lg w-full text-center">
                        {/* Error Icon */}
                        <div className="mb-8">
                            <AlertTriangle className="mx-auto h-24 w-24 text-red-500 mb-4" />
                            <div className="w-24 h-1 bg-red-500 mx-auto rounded-full"></div>
                        </div>

                        {/* Error Message */}
                        <div className="mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                Something went wrong!
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                We're experiencing technical difficulties. Our team has been notified and is working on a fix.
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                            <button
                                onClick={() => reset()}
                                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
                            >
                                <RefreshCw size={20} className="mr-2" />
                                Try Again
                            </button>

                            <a
                                href="/"
                                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-red-600 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors duration-200"
                            >
                                <Home size={20} className="mr-2" />
                                Go Home
                            </a>
                        </div>

                        {/* Technical Details (only in development) */}
                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border border-red-200 text-left">
                                <details>
                                    <summary className="text-sm font-medium text-red-800 cursor-pointer">
                                        Technical Details
                                    </summary>
                                    <pre className="mt-2 text-xs text-red-600 overflow-auto">
                                        {error?.message || 'Unknown error occurred'}
                                    </pre>
                                </details>
                            </div>
                        )}
                    </div>
                </div>
            </body>
        </html>
    );
}
