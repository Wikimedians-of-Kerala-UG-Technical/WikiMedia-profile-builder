'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, MapPin, Languages, Heart, FileText, Sparkles, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { useStore } from '@/store/useStore';

interface BasicInfoFormData {
  username: string;
  realName: string;
  location: string;
  languages: string;
  interests: string;
  aboutMe: string;
  occupation: string;
  joinYear: string;
}

export function BasicInfoForm() {
  const router = useRouter();
  const { setUsername, setRawWikitext } = useStore();
  
  const [formData, setFormData] = useState<BasicInfoFormData>({
    username: '',
    realName: '',
    location: '',
    languages: '',
    interests: '',
    aboutMe: '',
    occupation: '',
    joinYear: new Date().getFullYear().toString(),
  });

  const [errors, setErrors] = useState<Partial<BasicInfoFormData>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (field: keyof BasicInfoFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<BasicInfoFormData> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);
    setApiError(null);

    try {
      const response = await fetch('/api/generate-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate profile');
      }

      setUsername(formData.username.trim());
      setRawWikitext(data.wikitext);
      router.push('/editor');
    } catch (error) {
      console.error('Generation error:', error);
      setApiError(error instanceof Error ? error.message : 'Failed to generate profile. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#0057B7]" />
          Create New Profile
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Fill in your details and we&apos;ll generate wiki markup for your user page
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {apiError && (
          <ErrorBanner message={apiError} onDismiss={() => setApiError(null)} />
        )}

        <Input
          label="Username *"
          type="text"
          placeholder="Your Wikimedia username"
          value={formData.username}
          onChange={handleChange('username')}
          leftIcon={<User className="w-5 h-5" />}
          error={errors.username}
          disabled={isGenerating}
        />

        <Input
          label="Real Name (optional)"
          type="text"
          placeholder="Your real name (if you want to share)"
          value={formData.realName}
          onChange={handleChange('realName')}
          leftIcon={<User className="w-5 h-5" />}
          disabled={isGenerating}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Location"
            type="text"
            placeholder="e.g., New York, USA"
            value={formData.location}
            onChange={handleChange('location')}
            leftIcon={<MapPin className="w-5 h-5" />}
            disabled={isGenerating}
          />

          <Input
            label="Occupation"
            type="text"
            placeholder="e.g., Software Engineer"
            value={formData.occupation}
            onChange={handleChange('occupation')}
            leftIcon={<FileText className="w-5 h-5" />}
            disabled={isGenerating}
          />
        </div>

        <Input
          label="Languages (comma separated)"
          type="text"
          placeholder="e.g., English (native), Spanish (fluent), French (basic)"
          value={formData.languages}
          onChange={handleChange('languages')}
          leftIcon={<Languages className="w-5 h-5" />}
          disabled={isGenerating}
        />

        <Input
          label="Interests (comma separated)"
          type="text"
          placeholder="e.g., History, Science, Photography"
          value={formData.interests}
          onChange={handleChange('interests')}
          leftIcon={<Heart className="w-5 h-5" />}
          disabled={isGenerating}
        />

        <Input
          label="Year Joined Wikimedia"
          type="text"
          placeholder="e.g., 2024"
          value={formData.joinYear}
          onChange={handleChange('joinYear')}
          disabled={isGenerating}
        />

        <Textarea
          label="About Me"
          placeholder="Tell others about yourself, your contributions, and why you joined Wikimedia..."
          value={formData.aboutMe}
          onChange={handleChange('aboutMe')}
          rows={4}
          disabled={isGenerating}
        />

        <Button
          onClick={handleGenerate}
          className="w-full"
          isLoading={isGenerating}
          leftIcon={isGenerating ? <Wand2 className="w-5 h-5 animate-pulse" /> : <Sparkles className="w-5 h-5" />}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating with AI...' : 'Generate Wiki Profile'}
        </Button>

        <p className="text-xs text-center text-gray-400">
          Powered by AI for better styled wiki markup
        </p>
      </CardContent>
    </Card>
  );
}
