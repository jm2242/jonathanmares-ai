import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

// Get environment variables
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
const authSecret = process.env.AUTH_SECRET;
const nextAuthUrl = process.env.NEXTAUTH_URL;

// Log environment variable status (only in development or if missing)
if (process.env.NODE_ENV === "development") {
  console.log("NextAuth Environment Variables:");
  console.log("GITHUB_CLIENT_ID:", githubClientId ? "✓ Set" : "✗ Missing");
  console.log("GITHUB_CLIENT_SECRET:", githubClientSecret ? "✓ Set" : "✗ Missing");
  console.log("AUTH_SECRET:", authSecret ? "✓ Set" : "✗ Missing");
  console.log("NEXTAUTH_URL:", nextAuthUrl || "Not set (will use auto-detection)");
}

// Warn about missing variables but don't throw - let NextAuth handle validation
// Throwing at module load time prevents the app from loading in production
if (!githubClientId || !githubClientSecret) {
  console.error(
    "[NextAuth] Missing GitHub OAuth credentials. Sign-in will fail.",
    "\n  GITHUB_CLIENT_ID:",
    githubClientId ? "Set" : "Missing",
    "\n  GITHUB_CLIENT_SECRET:",
    githubClientSecret ? "Set" : "Missing"
  );
}

if (!authSecret) {
  console.error(
    "[NextAuth] Missing AUTH_SECRET. Session encryption will fail. Generate with: openssl rand -base64 32"
  );
}

if (!nextAuthUrl) {
  console.warn(
    "[NextAuth] NEXTAUTH_URL not set. NextAuth will try to auto-detect, but this may fail in production."
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: githubClientId || "",
      clientSecret: githubClientSecret || "",
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
