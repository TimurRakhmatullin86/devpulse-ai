import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: { params: { scope: "read:user user:email read:org repo" } },
    }),
    // Demo login — no password required, just the demo email
    CredentialsProvider({
      id: "demo-login",
      name: "Demo Account",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        if (credentials?.email !== "demo@devpulse.dev") return null;
        const user = await prisma.user.findUnique({
          where: { email: "demo@devpulse.dev" },
        });
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as { id: string }).id = token.id as string;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      const existing = await prisma.organizationMember.findFirst({
        where: { userId: user.id },
      });
      if (!existing) {
        const org = await prisma.organization.upsert({
          where: { id: "demo-org" },
          update: {},
          create: { id: "demo-org", name: "My Organization" },
        });
        await prisma.organizationMember.create({
          data: {
            userId: user.id,
            orgId: org.id,
            role: "admin",
          },
        });
      }
    },
  },
  pages: {
    signIn: "/",
  },
};
