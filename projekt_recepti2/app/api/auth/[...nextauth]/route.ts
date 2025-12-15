import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account }) {
      // samo Google
      if (account?.provider === "google") {
        if (!user.email) return false;

        // preveri če user že obstaja
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        // če ne obstaja → ustvarimo
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              googleId: account.providerAccountId,
            },
          });
        }

        return true;
      }

      return true;
    },
  },
});

export { handler as GET, handler as POST };
