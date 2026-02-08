'use client';

import { useState, useRef, useEffect } from 'react';
import { Wand2, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';

interface AIEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (instruction: string, selectedText: string) => Promise<void>;
  selectedText: string;
  isLoading: boolean;
}

export function AIEditModal({
  isOpen,
  onClose,
  onApply,
  selectedText,
  isLoading,
}: AIEditModalProps) {
  const [instruction, setInstruction] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Reset instruction when modal opens
    if (isOpen) {
      setInstruction('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim()) return;
    await onApply(instruction, selectedText);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#0057B7]/5 to-purple-500/5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#0057B7]/10 rounded-lg">
              <Wand2 className="w-5 h-5 text-[#0057B7]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI Edit Assistant</h3>
              <p className="text-xs text-gray-500">Powered by Gemini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {selectedText && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Selected Text
              </label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600 max-h-24 overflow-y-auto">
                <code className="whitespace-pre-wrap break-words">
                  {selectedText.length > 200
                    ? selectedText.slice(0, 200) + '...'
                    : selectedText}
                </code>
              </div>
            </div>
          )}

          <Textarea
            ref={textareaRef}
            label="What would you like to change?"
            placeholder={
              selectedText
                ? 'e.g., "Make this more formal", "Add more details about my contributions", "Translate to Spanish"'
                : 'e.g., "Add a new section about my projects", "Improve the styling of the infobox", "Make the about section more engaging"'
            }
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            disabled={isLoading}
          />

          <p className="text-xs text-gray-400">
            {selectedText
              ? 'Only the selected text will be modified. Press Ctrl+Enter to apply.'
              : 'Describe your changes. The AI will modify only what\'s necessary. Press Ctrl+Enter to apply.'}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              leftIcon={<Sparkles className="w-4 h-4" />}
              disabled={!instruction.trim() || isLoading}
            >
              {isLoading ? 'Applying...' : 'Apply AI Edit'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
