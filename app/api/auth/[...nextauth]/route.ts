import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

const handler = NextAuth({
  // FIX: Explicitly use the secret from Vercel settings
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Register Number", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // 1. Check if user typed something
        if (!credentials?.username) return null;

        // 2. Find the student in the database
        const student = await prisma.student.findUnique({
          where: { registerNo: credentials.username }
        });

        // 3. If student found, log them in
        if (student) {
          return { 
            id: String(student.id), 
            name: student.name, 
            email: student.registerNo // Using RegisterNo as email for uniqueness
          };
        }

        // 4. If not found, login fails
        return null;
      }
    })
  ],
})

export { handler as GET, handler as POST }