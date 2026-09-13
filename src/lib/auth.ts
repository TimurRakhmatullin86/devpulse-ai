import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
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
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as { id: string }).id = user.id;
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
