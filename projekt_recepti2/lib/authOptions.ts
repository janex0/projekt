import { PrismaClient } from "@prisma/client";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import NextAuth, { type NextAuthConfig } from "next-auth";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/**
 * Konfiguracija za NextAuth v5
 * Vključuje Google OAuth in credentials provider z JWT strategijo
 */
export const authOptions: NextAuthConfig = {
  // Uporaba JWT strategije za session management (brez adapterja za poenostavitev)
  session: { strategy: "jwt" },

  providers: [
    // Google OAuth provider za prijavo z Google računom
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Credentials provider za prijavo z emailom in geslom
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      /**
       * Avtorizacijska funkcija za credentials provider
       * Preveri uporabniške podatke in vrne user object če je avtentikacija uspešna
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        // Poišči uporabnika v bazi
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        // Preveri geslo z bcrypt
        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!valid) return null;

        // Vrni user object za NextAuth
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  /**
   * Callbacks za prilagoditev avtentikacijskega toka
   */
  callbacks: {
    /**
     * signIn callback - izvede se po uspešni avtentikaciji
     * Za Google uporabnike ustvari zapis v bazi če ne obstaja
     */
    async signIn({ user, account }: { user: any; account?: any }) {
      if (account?.provider === "google") {
        const existing = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (!existing) {
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              googleId: account.providerAccountId,
            },
          });
        }
      }
      return true;
    },

    /**
     * jwt callback - doda dodatne podatke v JWT token
     */
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },

    /**
     * session callback - doda podatke iz tokena v session objekt
     */
    async session({ session, token, user }: { session: any; token: any; user: any }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

/**
 * Eksportirani objekti iz NextAuth za uporabo v aplikaciji
 */
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
