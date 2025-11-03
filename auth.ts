import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

// Get environment variables
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: githubClientId!,
      clientSecret: githubClientSecret!,
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
    signIn: "/board",
  },
});
