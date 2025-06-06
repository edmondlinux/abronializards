
'use client'
import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ 
    value, 
    onChange, 
    language = 'html',
    height = '300px',
    placeholder = 'Enter your code here...',
    className = ''
}) => {
    const handleEditorChange = (value) => {
        onChange(value || '');
    };

    const editorOptions = {
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        insertSpaces: true,
        wordWrap: 'on',
        folding: true,
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 3,
        renderLineHighlight: 'line',
        selectOnLineNumbers: true,
        bracketPairColorization: {
            enabled: true
        },
        suggest: {
            showKeywords: true,
            showSnippets: true
        },
        quickSuggestions: {
            other: true,
            comments: true,
            strings: true
        }
    };

    return (
        <div className={`border border-gray-300 rounded overflow-hidden ${className}`}>
            <Editor
                height={height}
                language={language}
                value={value}
                onChange={handleEditorChange}
                options={editorOptions}
                theme="vs"
                loading={
                    <div className="flex items-center justify-center h-full">
                        <div className="text-gray-500">Loading editor...</div>
                    </div>
                }
                beforeMount={(monaco) => {
                    // Configure HTML validation
                    monaco.languages.html.htmlDefaults.setOptions({
                        validate: true,
                        format: {
                            tabSize: 2,
                            insertSpaces: true,
                            wrapLineLength: 120,
                            unformatted: 'default"',
                            contentUnformatted: 'pre,code,textarea',
                            indentInnerHtml: false,
                            preserveNewLines: true,
                            maxPreserveNewLines: undefined,
                            indentHandlebars: false,
                            endWithNewline: false,
                            extraLiners: 'head, body, /html',
                            wrapAttributes: 'auto'
                        }
                    });

                    // Configure CSS validation
                    monaco.languages.css.cssDefaults.setOptions({
                        validate: true,
                        lint: {
                            compatibleVendorPrefixes: 'ignore',
                            vendorPrefix: 'warning',
                            duplicateProperties: 'warning',
                            emptyRules: 'warning',
                            importStatement: 'ignore',
                            boxModel: 'ignore',
                            universalSelector: 'ignore',
                            zeroUnits: 'ignore',
                            fontFaceProperties: 'warning',
                            hexColorLength: 'error',
                            argumentsInColorFunction: 'error',
                            unknownProperties: 'warning',
                            ieHack: 'ignore',
                            unknownVendorSpecificProperties: 'ignore',
                            propertyIgnoredDueToDisplay: 'warning',
                            important: 'ignore',
                            float: 'ignore',
                            idSelector: 'ignore'
                        }
                    });

                    // Configure JavaScript validation
                    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                        noSemanticValidation: false,
                        noSyntaxValidation: false
                    });
                }}
            />
        </div>
    );
};

export default CodeEditor;
