// app/api/auth/[...nextauth]/route.ts

import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAILS = [
  "saisiddharthvooka@gmail.com",
  "kothaig2@srmist.edu.in",
];

export const authOptions: NextAuthOptions = {
  // NEXTAUTH_SECRET must be set in .env / Vercel, but we don't throw manually
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    // 🔐 Control who is allowed to sign in
    async signIn({ user, account }) {
      const email = user.email;
      if (!email) return false;

      // 1) Admins can always log in
      if (ADMIN_EMAILS.includes(email)) return true;

      // 2) For Google logins, require SRMIST email domain
      if (account?.provider === "google" && !email.endsWith("@srmist.edu.in")) {
        return false;
      }

      // 3) Allow only if this email exists in Student table
      const student = await prisma.student.findFirst({
        where: { email },
      });

      return !!student;
    },

    // 🔄 Attach student info to the session
    async session({ session }) {
      if (!session.user?.email) return session;

      const student = await prisma.student.findFirst({
        where: { email: session.user.email },
        select: {
          id: true,
          registerNo: true,
          name: true,
        },
      });

      if (student) {
        (session.user as any).studentId = student.id;
        (session.user as any).registerNo = student.registerNo;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
