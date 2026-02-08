# User Guide

A comprehensive guide to using the Wiki Profile Builder application.

## Table of Contents

- [Getting Started](#getting-started)
- [Features Overview](#features-overview)
- [Using the Profile Fetcher](#using-the-profile-fetcher)
- [Creating a New Profile](#creating-a-new-profile)
- [Using the Editor](#using-the-editor)
- [Advanced Features](#advanced-features)
- [Tips and Best Practices](#tips-and-best-practices)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Accessing the Application

1. Open your web browser
2. Navigate to the application URL
3. You'll land on the home page with two main options:
   - **Fetch Existing Profile**: Import your current Wikimedia user page
   - **Create New Profile**: Build a profile from scratch

### Authentication (Optional)

While you can use most features without logging in, authentication provides:
- Saved preferences
- Profile history (future feature)
- Personalized experience

To register or login:
1. Click "Login" or "Register" in the header
2. Enter your email and password
3. For registration, confirm your password

## Features Overview

### 🔍 Profile Fetching
Import existing user pages from Wikimedia projects to edit them.

### ✨ AI-Powered Generation
Create professional profiles using Google's Gemini AI or smart templates.

### 📝 Live Editor
Edit wikitext and see live HTML preview in real-time.

### 🎨 Visual Customization
Customize colors, add images, and organize content sections.

### 📋 Copy to Clipboard
Easily copy generated wikitext to paste on Wikimedia.

## Using the Profile Fetcher

The Profile Fetcher allows you to import existing Wikimedia user pages for editing.

### Step-by-Step Guide

1. **Select the "Fetch Existing Profile" tab** on the home page

2. **Enter your Wikimedia username**
   - Example: "JohnDoe" (without "User:" prefix)
   - Must be an existing username on the selected wiki

3. **Choose the Wiki Project**
   - Meta-Wiki (default)
   - English Wikipedia
   - Wikimedia Commons
   - Wikidata
   - English Wiktionary

4. **Click "Fetch Your Profile"**
   - The app will retrieve your user page content
   - You'll be redirected to the editor

5. **Edit and customize** in the editor

### Supported Wiki Projects

| Project | Domain | Use Case |
|---------|--------|----------|
| Meta-Wiki | meta.wikimedia.org | Wikimedia coordination |
| English Wikipedia | en.wikipedia.org | Encyclopedia articles |
| Wikimedia Commons | commons.wikimedia.org | Media repository |
| Wikidata | www.wikidata.org | Structured data |
| English Wiktionary | en.wiktionary.org | Dictionary |

### Common Issues

**"User page does not exist"**
- The username doesn't have a user page yet
- Try creating a new profile instead
- Verify the username is correct

**"Failed to fetch profile"**
- Check your internet connection
- The Wikimedia API might be temporarily unavailable
- Try again in a few moments

## Creating a New Profile

Perfect for beginners or creating a profile from scratch.

### Step-by-Step Guide

1. **Select the "Create New Profile" tab**

2. **Fill in Basic Information**

   **Required:**
   - **Username**: Your Wikimedia username

   **Optional but Recommended:**
   - **Real Name**: Your actual name (if you want to share it)
   - **Location**: City, Country (e.g., "New York, USA")
   - **Occupation**: Your profession or role
   - **Join Year**: When you joined Wikimedia (defaults to current year)

3. **Add Languages**
   - Format: "English (native), Spanish (fluent), French (basic)"
   - Helps other contributors know your language skills

4. **Add Interests/Hobbies**
   - Separate with commas
   - Example: "Photography, Open Source, History, Science"

5. **Write About Me**
   - Brief introduction about yourself
   - Your Wikimedia interests and contributions
   - Why you contribute

6. **Add Custom Sections (Optional)**
   - Click "Add Category"
   - Give it a label (e.g., "My Contributions", "Current Projects")
   - Add description/content

7. **Upload Images (Optional)**
   - Add image URLs (must be publicly accessible)
   - Add captions for context
   - Images will be embedded in the profile

8. **Customize Colors (Optional)**
   - Primary: Main color for headers
   - Accent: Background highlights
   - Background: Main background
   - Text: Text color

9. **Click "Generate Profile"**
   - AI will generate wikitext (if configured)
   - Or template-based generation will create it
   - You'll see the code with a typing animation

10. **Review and Edit**
    - Click "Edit in Editor" to refine
    - Or copy and paste directly to Wikimedia

### Profile Generation Modes

**AI Mode** (if Gemini API key is configured):
- More creative and detailed
- Adapts to your specific information
- Generates natural language
- Creates attractive layouts

**Template Mode** (fallback):
- Reliable and consistent
- Professional appearance
- Works offline
- No API key required

Both modes create valid MediaWiki markup that you can use directly.

## Using the Editor

The editor is the heart of the application, where you refine your profile.

### Editor Interface

```
┌─────────────────────────────────────┐
│         Header & Navigation          │
├─────────────────────────────────────┤
│  Username | Domain | View Controls  │
├──────────────────┬──────────────────┤
│                  │                  │
│   Code Editor    │  HTML Preview    │
│   (Wikitext)     │  (Rendered)      │
│                  │                  │
│                  │                  │
└──────────────────┴──────────────────┘
```

### View Modes

1. **Split View** (Default)
   - Code editor on the left
   - Preview on the right
   - Best for editing and seeing results

2. **Code Only**
   - Full-width code editor
   - For focused editing
   - Better for small screens

3. **Preview Only**
   - Full-width preview
   - See the rendered result
   - Review before copying

### Editing Wikitext

The code editor supports MediaWiki markup syntax:

**Headers:**
```wiki
== Main Heading ==
=== Sub Heading ===
```

**Text Formatting:**
```wiki
'''Bold text'''
''Italic text''
'''''Bold and italic'''''
```

**Lists:**
```wiki
* Bullet point
* Another bullet
** Nested bullet

# Numbered item
# Another item
## Nested number
```

**Links:**
```wiki
[[Page name]]
[[Page name|Display text]]
[https://example.com External link]
```

**Tables:**
```wiki
{| class="wikitable"
|-
! Header 1
! Header 2
|-
| Cell 1
| Cell 2
|}
```

### Live Preview

- Preview updates automatically as you type
- Debounced to avoid excessive API calls (500ms delay)
- Shows exactly how it will look on Wikimedia
- Sanitized for security

### Visual Editing

1. **Click "Edit Visually"** in the preview pane
2. Modify the HTML content directly
3. **Click "Save Changes"** to convert back to wikitext
4. The editor will attempt to preserve your changes

**Note**: Visual editing is experimental. Complex wikitext may not convert perfectly.

### AI-Powered Editing

1. **Select text** in the editor (optional)
2. **Click the "AI Edit" button**
3. **Enter instructions**:
   - "Make this more professional"
   - "Add more detail"
   - "Simplify the language"
   - "Add examples"
4. **Review and apply** the suggested changes

**Requires**: Gemini API key configured

### Copying Your Profile

1. **Click "Copy Code"** button in the header
2. The wikitext is copied to your clipboard
3. **Go to your Wikimedia user page**:
   - Navigate to `https://meta.wikimedia.org/wiki/User:YourUsername`
   - Click "Edit"
4. **Paste** the wikitext
5. **Preview** to verify it looks correct
6. **Publish** the changes

### Resetting Changes

- **Click "Reset"** to revert to the original wikitext
- Useful if you make mistakes
- Can't be undone, so use carefully

## Advanced Features

### Custom Styling with Inline CSS

You can add custom styles directly in your wikitext:

```wiki
<div style="background: #f0f0f0; padding: 20px; border-radius: 8px;">
Custom styled content here
</div>
```

### Using Wiki Templates

Include Wikimedia templates in your profile:

```wiki
{{Babel|en-N|es-3|fr-1}}
{{User:Username/Userbox}}
```

### Adding User Boxes

Create attractive user boxes:

```wiki
{| class="userbox"
|-
| This user loves '''Open Source'''
|}
```

### Organizing with Categories

Add categories at the end of your profile:

```wiki
[[Category:Wikipedians]]
[[Category:Wikipedians in United States]]
[[Category:User en-N]]
```

### Embedding Images from Commons

```wiki
[[File:Example.jpg|thumb|200px|Caption text]]
```

Make sure the file exists on Wikimedia Commons.

## Tips and Best Practices

### Profile Content

✅ **Do:**
- Be genuine and authentic
- Include your Wikimedia interests
- Mention your contribution areas
- Add your language skills
- Keep it professional but friendly
- Update regularly

❌ **Don't:**
- Share sensitive personal information
- Use offensive language
- Make false claims
- Spam with links
- Copy others' content

### Wikitext Best Practices

1. **Keep it Simple**: Start with basic markup, add complexity later
2. **Test Locally**: Use the preview before publishing
3. **Use Tables Sparingly**: They're complex and hard to maintain
4. **Comment Your Code**: Add HTML comments for future reference
5. **Validate Links**: Ensure all links work before publishing

### Styling Guidelines

1. **Use Consistent Colors**: Stick to 2-3 main colors
2. **Ensure Readability**: High contrast for text
3. **Mobile Friendly**: Avoid fixed widths
4. **Wikimedia Guidelines**: Follow wiki styling conventions

### Performance

1. **Optimize Images**: Use appropriate sizes, not full resolution
2. **Limit Tables**: Large tables slow down rendering
3. **Avoid Heavy Styling**: Excessive CSS increases load time

## Troubleshooting

### Editor Issues

**Preview not updating**
- Wait a moment (500ms debounce)
- Check internet connection
- Try refreshing the page

**Wikitext looks different on wiki**
- Wiki CSS may be different
- Some templates might not work locally
- Test on a sandbox page first

**Visual editing breaks formatting**
- HTML to wikitext conversion is imperfect
- Use with caution on complex markup
- Keep a backup before visual editing

### Generation Issues

**Profile generation fails**
- Check if all required fields are filled
- Verify internet connection
- Template mode will be used as fallback

**AI generates unexpected content**
- Refine your input descriptions
- Use the editor to fix issues
- Try generating again with clearer info

### Copy/Paste Issues

**Formatting lost when pasting**
- Use the "Copy Code" button, not manual selection
- Ensure you're in source/edit mode on wiki
- Don't paste in visual editor

**Code doesn't work on wiki**
- Some features may be wiki-specific
- Check MediaWiki version differences
- Test on a sandbox page first

### Authentication Issues

**Can't register/login**
- Verify email format
- Check password requirements
- Ensure internet connection
- Clear browser cache

**Session expires**
- Firebase sessions last 1 hour by default
- Login again to continue
- Sessions persist across page reloads

## Getting Help

If you need additional help:

- 📚 Check the [README](../README.md) for general info
- 🔧 See [API Documentation](API.md) for technical details
- 🏗️ Read [Architecture Guide](ARCHITECTURE.md) for deeper understanding
- 🐛 Report issues on [GitHub Issues](https://github.com/MabelMoncy/TharangRepo/issues)
- 💬 Ask questions in [GitHub Discussions](https://github.com/MabelMoncy/TharangRepo/discussions)

---

Happy profile building! 🎉
