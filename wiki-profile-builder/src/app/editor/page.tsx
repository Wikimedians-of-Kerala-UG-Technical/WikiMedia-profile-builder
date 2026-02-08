'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { Code, Eye, ArrowLeft, RefreshCw, RotateCcw, Pencil, Save, X, Copy, Check } from 'lucide-react';
import { parseWikitext, convertHtmlToWikitext } from '@/services/wikiService';
import { useStore } from '@/store/useStore';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ErrorBanner } from '@/components/ui/ErrorBanner';


export default function EditorPage() {
  const router = useRouter();
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasParsedRef = useRef(false);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const {
    username,
    selectedDomain,
    rawWikitext,
    setRawWikitext,
    setRenderedHtml,
    _hasHydrated,
  } = useStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(true);
  const [localHtml, setLocalHtml] = useState<string>('');
  const [editedHtml, setEditedHtml] = useState<string>('');
  const [hasEdits, setHasEdits] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [savedHtml, setSavedHtml] = useState<string>('');
  const [originalWikitext, setOriginalWikitext] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);

  // Redirect if no wikitext is loaded (after hydration)
  useEffect(() => {
    if (_hasHydrated && !rawWikitext && !username) {
      router.push('/');
    }
  }, [_hasHydrated, rawWikitext, username, router]);

  // Handle visual edits in the preview
  const handlePreviewEdit = useCallback(() => {
    if (previewRef.current) {
      const html = previewRef.current.innerHTML;
      setEditedHtml(html);
    }
  }, []);

  // Start editing mode
  const handleStartEditing = useCallback(() => {
    setIsEditing(true);
    // Set the editable content after the element is rendered
    setTimeout(() => {
      if (previewRef.current) {
        previewRef.current.innerHTML = savedHtml || localHtml;
        previewRef.current.focus();
        // Place cursor at the end
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(previewRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }, 0);
  }, [localHtml, savedHtml]);

  // Save changes from editing and sync to wikitext
  const handleSaveChanges = useCallback(async () => {
    if (previewRef.current) {
      const html = previewRef.current.innerHTML;
      setSavedHtml(html);
      setEditedHtml(html);
      setHasEdits(true);
      
      // Auto-sync HTML changes to wikitext
      setIsSyncing(true);
      try {
        const result = await convertHtmlToWikitext(html);
        if (result.wikitext) {
          setRawWikitext(result.wikitext);
        }
      } catch (err) {
        console.error('Sync error:', err);
        setError('Failed to sync changes to code. Your visual changes are saved.');
      } finally {
        setIsSyncing(false);
      }
    }
    setIsEditing(false);
  }, [setRawWikitext]);

  // Cancel editing and revert
  const handleCancelEditing = useCallback(() => {
    setIsEditing(false);
    setEditedHtml('');
    // Changes are discarded - savedHtml retains the last saved state
  }, []);

  // Parse wikitext function
  const parseNow = useCallback(
    async (text: string) => {
      if (!text) {
        setIsLoading(false);
        return;
      }

      // Abort previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setError(null);

      try {
        const result = await parseWikitext(
          text,
          selectedDomain,
          abortControllerRef.current.signal
        );

        if (result.success && result.html) {
          // Sanitize HTML with DOMPurify before rendering
          const sanitizedHtml = DOMPurify.sanitize(result.html, {
            ADD_TAGS: ['iframe'],
            ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
          });
          setLocalHtml(sanitizedHtml);
          setRenderedHtml(sanitizedHtml);
          setError(null);
        } else if (result.error && result.error !== 'Request cancelled') {
          setError(result.error);
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError('Failed to parse wikitext');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [selectedDomain, setRenderedHtml]
  );

  // Parse wikitext with 500ms debounce
  const parseWithDebounce = useCallback(
    (text: string) => {
      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setIsLoading(true);

      // Create new timeout
      timeoutRef.current = setTimeout(() => {
        parseNow(text);
      }, 500);
    },
    [parseNow]
  );

  // Initial parse on mount - run once when store is hydrated and wikitext exists
  useEffect(() => {
    if (_hasHydrated && rawWikitext && !hasParsedRef.current) {
      hasParsedRef.current = true;
      // Store original wikitext for change tracking
      if (!originalWikitext) {
        setOriginalWikitext(rawWikitext);
      }
      parseNow(rawWikitext);
    } else if (_hasHydrated && !rawWikitext) {
      setIsLoading(false);
    }
    
    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [_hasHydrated, rawWikitext, parseNow, originalWikitext]);

  const handleWikitextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setRawWikitext(newText);
    setHasEdits(true);
    parseWithDebounce(newText);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(rawWikitext);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setError('Failed to copy code to clipboard');
    }
  };

  const handleRefresh = () => {
    if (rawWikitext) {
      parseNow(rawWikitext);
    }
  };

  // Check if code has changed from original
  const hasCodeChanges = originalWikitext && rawWikitext !== originalWikitext;

  // Show loading while store is hydrating
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
              </Link>
              <div className="text-sm text-gray-600">
                Editing: <span className="font-medium">User:{username}</span> on{' '}
                <span className="font-medium">{selectedDomain}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCode(!showCode)}
                leftIcon={showCode ? <Eye className="w-4 h-4" /> : <Code className="w-4 h-4" />}
              >
                {showCode ? 'Hide Code' : 'Show Code'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Refresh
              </Button>
              {isSyncing && (
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Syncing...
                </span>
              )}
              {hasCodeChanges && !isSyncing && (
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                  Code modified
                </span>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={handleCopyCode}
                leftIcon={isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              >
                {isCopied ? 'Copied!' : 'Copy Code'}
              </Button>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="px-4 py-2 bg-red-50">
            <div className="max-w-7xl mx-auto">
              <ErrorBanner message={error} onDismiss={() => setError(null)} />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Left: Live Preview (Primary) */}
          <div className={`flex-1 flex flex-col bg-white ${showCode ? 'lg:w-1/2' : 'w-full'}`}>
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#0057B7]" />
                <span className="text-sm font-medium text-gray-700">Visual Editor</span>
                {isEditing && (
                  <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                    Editing
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isLoading && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Rendering...
                  </div>
                )}
                {!isEditing && localHtml && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleStartEditing}
                    leftIcon={<Pencil className="w-4 h-4" />}
                  >
                    Edit Preview
                  </Button>
                )}
                {isEditing && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelEditing}
                      leftIcon={<X className="w-4 h-4" />}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveChanges}
                      leftIcon={<Save className="w-4 h-4" />}
                    >
                      Save Changes
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6">
              {isLoading && !localHtml ? (
                <div className="flex items-center justify-center h-full min-h-[200px]">
                  <Spinner size="lg" />
                </div>
              ) : localHtml ? (
                isEditing ? (
                  <div
                    ref={previewRef}
                    className="wiki-preview prose prose-sm max-w-none min-h-[200px] rounded focus:outline-none ring-2 ring-[#0057B7] ring-offset-2 cursor-text"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handlePreviewEdit}
                  />
                ) : (
                  <div
                    className="wiki-preview prose prose-sm max-w-none min-h-[200px] rounded cursor-default"
                    dangerouslySetInnerHTML={{ __html: savedHtml || localHtml }}
                  />
                )
              ) : (
                <div className="text-gray-400 text-center py-8">
                  {rawWikitext ? 'Loading preview...' : 'No content to preview'}
                </div>
              )}
            </div>
          </div>

          {/* Right: Wikitext Code Editor (Toggle) */}
          {showCode && (
            <div className="flex-1 flex flex-col border-l border-gray-200 lg:w-1/2">
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-gray-200">Wikitext Code</span>
                  {hasCodeChanges && (
                    <span className="px-2 py-0.5 text-xs bg-green-600 text-white rounded-full">
                      Modified
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">Edit code directly</span>
              </div>
              <textarea
                value={rawWikitext}
                onChange={handleWikitextChange}
                className="flex-1 w-full p-4 font-mono text-sm resize-none focus:outline-none bg-gray-900 text-green-400 focus:ring-2 focus:ring-green-500 focus:ring-inset"
                placeholder="Wikitext code will appear here..."
              />
            </div>
          )}
        </div>
      </div>

      {/* Wiki Preview Styles */}
      <style jsx global>{`
        .wiki-preview {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #202122;
        }
        .wiki-preview[contenteditable="true"]:empty:before {
          content: "Start editing here...";
          color: #a2a9b1;
        }
        .wiki-preview a {
          color: #0645ad;
        }
        .wiki-preview a:hover {
          text-decoration: underline;
        }
        .wiki-preview a.new {
          color: #d33;
        }
        .wiki-preview h1,
        .wiki-preview h2,
        .wiki-preview h3 {
          border-bottom: 1px solid #a2a9b1;
          padding-bottom: 0.3em;
          margin-top: 1em;
        }
        .wiki-preview table {
          border-collapse: collapse;
          margin: 1em 0;
        }
        .wiki-preview th,
        .wiki-preview td {
          border: 1px solid #a2a9b1;
          padding: 0.5em;
        }
        .wiki-preview th {
          background: #eaecf0;
        }
        .wiki-preview pre {
          background: #f8f9fa;
          padding: 1em;
          overflow-x: auto;
          border: 1px solid #eaecf0;
        }
        .wiki-preview code {
          background: #f8f9fa;
          padding: 0.2em 0.4em;
          border-radius: 2px;
          font-family: monospace;
        }
        .wiki-preview img {
          max-width: 100%;
          height: auto;
        }
        .wiki-preview .mw-parser-output {
          line-height: 1.6;
        }
        .wiki-preview .babel {
          float: right;
          clear: right;
          margin: 0 0 1em 1em;
        }
        .wiki-preview .userbox {
          margin: 0.5em;
        }
        .wiki-preview .infobox {
          border: 1px solid #a2a9b1;
          background: #f8f9fa;
          padding: 0.5em;
          margin: 0 0 1em 1em;
          float: right;
        }
      `}</style>

    </div>
  );
}
