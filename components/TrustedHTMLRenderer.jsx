
'use client';
import { useEffect, useRef } from 'react';
import { validateTrustedContent, logContentValidation } from '@/utils/trustedContentValidator';

const TrustedHTMLRenderer = ({ htmlContent, className = "" }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current || !htmlContent) return;

        // Validate content before rendering
        const validation = validateTrustedContent(htmlContent);
        logContentValidation(validation, 'blog-content');

        if (!validation.isValid) {
            console.error('Trusted content validation failed:', validation.errors);
            containerRef.current.innerHTML = '<p class="text-red-600">Content validation failed. Please contact administrator.</p>';
            return;
        }

        // Clear previous content
        containerRef.current.innerHTML = '';

        // Create a temporary div to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;

        // Process template variables first if they exist
        let processedHTML = htmlContent;

        // Check if there are template variables to process
        const hasTemplateVars = /\{\{[A-Z_]+\}\}/.test(htmlContent);

        if (hasTemplateVars) {
            // Extract script content that contains template data
            const scripts = tempDiv.querySelectorAll('script');
            let templateData = null;

            scripts.forEach(script => {
                const content = script.textContent || script.innerHTML;
                if (content.includes('templateData') && content.includes('SPECIES_')) {
                    try {
                        // Extract template data from script
                        const match = content.match(/const templateData = ({[\s\S]*?});/);
                        if (match) {
                            templateData = eval('(' + match[1] + ')');
                        }
                    } catch (error) {
                        console.warn('Could not extract template data:', error);
                    }
                }
            });

            // Replace template variables if we found template data
            if (templateData) {
                for (const [key, value] of Object.entries(templateData)) {
                    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
                    processedHTML = processedHTML.replace(regex, value);
                }

                // Re-parse the processed HTML
                tempDiv.innerHTML = processedHTML;
            }
        }

        // Extract and handle script tags safely
        const scripts = tempDiv.querySelectorAll('script');
        const scriptContents = [];

        scripts.forEach(script => {
            if (script.src) {
                // Handle external scripts
                const scriptElement = {
                    type: 'external',
                    src: script.src,
                    async: script.async || true
                };
                scriptContents.push(scriptElement);
            } else if (script.textContent) {
                // Handle inline scripts
                scriptContents.push({
                    type: 'inline',
                    content: script.textContent
                });
            }
            // Remove script from temp div to avoid duplication
            script.remove();
        });

        // Clean up any remaining unresolved template variables to prevent errors
        let finalHTML = tempDiv.innerHTML;

        // Replace any remaining template variables with safe placeholders
        finalHTML = finalHTML.replace(/\{\{[A-Z_]+\}\}/g, (match) => {
            console.warn('Unresolved template variable:', match);
            return `<span class="text-gray-400 italic">[${match.slice(2, -2)}]</span>`;
        });

        // Add the HTML content without scripts first
        containerRef.current.innerHTML = finalHTML;

        // Fix any onclick handlers that might reference undefined functions
        const elementsWithOnclick = containerRef.current.querySelectorAll('[onclick]');
        elementsWithOnclick.forEach(element => {
            const onclickValue = element.getAttribute('onclick');
            if (onclickValue) {
                // Create a safer onclick handler
                element.removeAttribute('onclick');
                element.addEventListener('click', function(e) {
                    try {
                        // Try to execute the onclick code in a safe context
                        const clickFunction = new Function('event', onclickValue);
                        clickFunction.call(this, e);
                    } catch (error) {
                        console.warn('Error executing onclick handler:', error);
                        console.warn('Original onclick code:', onclickValue);
                    }
                });
            }
        });

        // Then safely add and execute scripts
        scriptContents.forEach(scriptInfo => {
            try {
                if (scriptInfo.type === 'external') {
                    // Check if script is already loaded
                    const existingScript = document.querySelector(`script[src="${scriptInfo.src}"]`);
                    if (!existingScript) {
                        const scriptEl = document.createElement('script');
                        scriptEl.src = scriptInfo.src;
                        scriptEl.async = scriptInfo.async;
                        scriptEl.onload = () => {
                            console.log('External script loaded:', scriptInfo.src);
                        };
                        scriptEl.onerror = () => {
                            console.error('Failed to load external script:', scriptInfo.src);
                        };
                        document.head.appendChild(scriptEl);
                    }
                } else if (scriptInfo.type === 'inline') {
                    // Skip template processing scripts as they've already been processed
                    if (scriptInfo.content.includes('templateData') || 
                        scriptInfo.content.includes('populateTemplate')) {
                        return;
                    }

                    try {
                        // Create a safer execution context for the script
                        const scriptFunction = new Function(scriptInfo.content);
                        scriptFunction.call(window);
                    } catch (error) {
                        console.warn('Error executing inline script:', error);
                        // Fallback to traditional script element creation
                        try {
                            const scriptEl = document.createElement('script');
                            scriptEl.textContent = scriptInfo.content;
                            containerRef.current.appendChild(scriptEl);
                        } catch (fallbackError) {
                            console.error('Failed to execute script with fallback method:', fallbackError);
                        }
                    }
                }
            } catch (error) {
                console.error('Error executing script:', error);
            }
        });

        // Cleanup function
        return () => {
            // Remove any scripts we added to prevent memory leaks
            const addedScripts = containerRef.current?.querySelectorAll('script');
            addedScripts?.forEach(script => {
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            });
        };
    }, [htmlContent]);

    return <div ref={containerRef} className={className} />;
};

export default TrustedHTMLRenderer;
