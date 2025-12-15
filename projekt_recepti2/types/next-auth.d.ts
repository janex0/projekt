import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: int;
      role: string;
      email?: string | null;
      name?: string | null;
    };
  }

  interface User {
    id: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: int;
    role?: string;
  }
}
