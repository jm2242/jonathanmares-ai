import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

// Validate required environment variables
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const authSecret = process.env.AUTH_SECRET;
const nextAuthUrl = process.env.NEXTAUTH_URL;

if (!githubClientId || !githubClientSecret) {
  console.error('Missing GitHub OAuth credentials:');
  console.error('GITHUB_CLIENT_ID:', githubClientId ? 'Set' : 'Missing');
  console.error('GITHUB_CLIENT_SECRET:', githubClientSecret ? 'Set' : 'Missing');
  throw new Error('Missing GitHub OAuth environment variables');
}

if (!authSecret) {
  console.error('Missing AUTH_SECRET - NextAuth requires this for session encryption');
  throw new Error('Missing AUTH_SECRET environment variable');
}

if (!nextAuthUrl) {
  console.warn('Missing NEXTAUTH_URL - NextAuth may not work correctly');
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.githubId = profile.id;
        token.githubUsername = profile.login;
        token.githubAvatar = profile.avatar_url;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.githubId as string;
        session.user.username = token.githubUsername as string;
        session.user.image = token.githubAvatar as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/board',
  },
});

