
/**
 * Utility to validate and sanitize trusted HTML content from admin/seller sources
 * This provides an additional security layer even for trusted content
 */

const ALLOWED_SCRIPT_DOMAINS = [
    'cdn.tailwindcss.com',
    'cdnjs.cloudflare.com',
    'cdn.jsdelivr.net',
    'unpkg.com',
    'ik.imagekit.io'
    // Add other trusted CDN domains as needed
];

export const validateTrustedContent = (htmlContent) => {
    if (!htmlContent || typeof htmlContent !== 'string') {
        return { isValid: false, errors: ['Invalid content'] };
    }

    const errors = [];
    const warnings = [];

    // Parse HTML to check for potential issues
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    // Check script sources
    const scripts = tempDiv.querySelectorAll('script[src]');
    scripts.forEach(script => {
        const src = script.getAttribute('src');
        if (src) {
            try {
                const url = new URL(src);
                const domain = url.hostname;

                if (!ALLOWED_SCRIPT_DOMAINS.some(allowedDomain => 
                    domain === allowedDomain || domain.endsWith('.' + allowedDomain)
                )) {
                    warnings.push(`External script from untrusted domain: ${domain}`);
                }
            } catch (error) {
                if (!src.startsWith('/') && !src.startsWith('./')) {
                    errors.push(`Invalid script URL: ${src}`);
                }
            }
        }
    });

    // Check for potentially dangerous inline scripts
    const inlineScripts = tempDiv.querySelectorAll('script:not([src])');
    inlineScripts.forEach(script => {
        const content = script.textContent || script.innerHTML;

        // Check for potentially dangerous patterns (exclude template processing)
        const dangerousPatterns = [
            /document\.cookie/i,
            /localStorage/i,
            /sessionStorage/i,
            /window\.location\.href\s*=/i,
            /new\s+Function\s*\(/i,
            /outerHTML\s*=/i
        ];

        // Allow certain patterns for template processing
        const isTemplateScript = /templateData|populateTemplate/.test(content);

        // Skip dangerous pattern checks for template processing scripts
        if (!isTemplateScript) {
            dangerousPatterns.forEach(pattern => {
                if (pattern.test(content)) {
                    warnings.push(`Potentially risky script pattern detected: ${pattern.source}`);
                }
            });
        }
    });

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        hasScripts: scripts.length > 0 || inlineScripts.length > 0
    };
};

export const logContentValidation = (validationResult, contentId) => {
    if (validationResult.warnings.length > 0) {
        console.warn(`Content validation warnings for ${contentId}:`, validationResult.warnings);
    }

    if (validationResult.errors.length > 0) {
        console.error(`Content validation errors for ${contentId}:`, validationResult.errors);
    }
};
