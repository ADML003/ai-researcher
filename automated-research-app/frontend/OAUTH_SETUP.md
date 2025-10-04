# OAuth Integration Setup Guide

This document explains how to set up Google and GitHub OAuth authentication for the Automated Research App.

## Current Implementation Status

✅ **Mock OAuth Functions**: Google and GitHub sign-in functions are implemented with mock data  
✅ **UI Integration**: OAuth buttons added to signin page with proper loading states  
✅ **User Data Separation**: Users' research data is isolated by user ID  
✅ **Provider Tracking**: User's OAuth provider is tracked and displayed in header

## Setting Up Real OAuth Integration

### 1. Google OAuth Setup

1. **Create Google Cloud Project**:

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API and Google OAuth2 API

2. **Configure OAuth Consent Screen**:

   - Go to APIs & Credentials > OAuth consent screen
   - Fill in app information, privacy policy, terms of service
   - Add test users if in development

3. **Create OAuth Client ID**:

   - Go to APIs & Credentials > Credentials
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3001/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)

4. **Environment Variables**:
   ```bash
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

### 2. GitHub OAuth Setup

1. **Create GitHub OAuth App**:

   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Click "New OAuth App"
   - Fill in application details
   - Set Authorization callback URL:
     - `http://localhost:3001/api/auth/callback/github` (development)
     - `https://yourdomain.com/api/auth/callback/github` (production)

2. **Environment Variables**:
   ```bash
   NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

### 3. Implementation Options

#### Option A: NextAuth.js (Recommended)

NextAuth.js provides a complete OAuth solution with built-in providers:

```bash
npm install next-auth
```

Create `app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add provider info to session
      session.user.provider = token.provider;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
```

#### Option B: Manual OAuth Implementation

For custom OAuth flows, implement API routes:

- `app/api/auth/google/route.ts`
- `app/api/auth/github/route.ts`
- `app/api/auth/callback/route.ts`

### 4. Update OAuth Functions

Replace the mock functions in `app/providers.tsx`:

```typescript
export const signInWithGoogle = async (): Promise<Partial<User>> => {
  // Redirect to Google OAuth
  window.location.href = "/api/auth/signin/google";
  // This won't return directly - user will be redirected back
  return new Promise(() => {});
};

export const signInWithGitHub = async (): Promise<Partial<User>> => {
  // Redirect to GitHub OAuth
  window.location.href = "/api/auth/signin/github";
  // This won't return directly - user will be redirected back
  return new Promise(() => {});
};
```

### 5. Backend User Management

Update the backend to handle OAuth users:

1. **User Model Updates**:

   - Add `provider` field to user table
   - Add `provider_id` field for OAuth user IDs
   - Add `avatar_url` field for profile pictures

2. **API Endpoints**:
   - `POST /api/users/oauth` - Create/update OAuth user
   - `GET /api/users/me` - Get current user info
   - Update research endpoints to filter by user ID

### 6. Data Separation Implementation

The frontend already implements user data separation in the logout function:

```typescript
// Clear user-specific data
const keysToRemove = Object.keys(localStorage).filter(
  (key) =>
    key.startsWith("research_") ||
    key.startsWith("report_") ||
    key.startsWith("interview_")
);
keysToRemove.forEach((key) => localStorage.removeItem(key));
```

Ensure backend APIs also filter data by user:

```python
# Example backend filter
@app.get("/api/research/{session_id}")
async def get_research(session_id: str, current_user: User = Depends(get_current_user)):
    research = db.query(Research).filter(
        Research.session_id == session_id,
        Research.user_id == current_user.id
    ).first()
    if not research:
        raise HTTPException(status_code=404, detail="Research not found")
    return research
```

## Security Considerations

1. **Environment Variables**: Never commit OAuth credentials to version control
2. **HTTPS**: Always use HTTPS in production for OAuth redirects
3. **State Parameter**: Use state parameter to prevent CSRF attacks
4. **Token Storage**: Store access tokens securely (httpOnly cookies recommended)
5. **Data Isolation**: Ensure users can only access their own research data

## Testing OAuth Integration

1. **Development**: Test with localhost redirect URIs
2. **Staging**: Use staging environment with test OAuth apps
3. **User Flows**: Test sign-up, sign-in, and data separation
4. **Edge Cases**: Test expired tokens, revoked permissions, etc.

## Current Mock Data

The current implementation uses mock data:

- Google users get avatar from `lh3.googleusercontent.com`
- GitHub users get avatar from `github.com/identicons`
- Provider information is stored and displayed in UI
- User data separation works with mock user IDs

This allows testing the complete user experience before implementing real OAuth.
