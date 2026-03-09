import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, profile }) {
      // On first sign-in, profile is available — upsert user in DB
      if (profile) {
        const user = await prisma.user.upsert({
          where: { googleId: profile.sub! },
          update: {
            name: profile.name ?? null,
            picture: (profile.picture as string) ?? null,
            email: profile.email!,
          },
          create: {
            googleId: profile.sub!,
            email: profile.email!,
            name: profile.name ?? null,
            picture: (profile.picture as string) ?? null,
          },
        });
        token.userId = user.id;
        token.picture = user.picture;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = String(token.userId);
        session.user.image = token.picture as string | null | undefined;
      }
      return session;
    },
  },
});
