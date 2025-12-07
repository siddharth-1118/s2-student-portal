import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

// FIX: We export this object so other API routes can check if a user is logged in
export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" as const }, // 'as const' fixes a common TypeScript warning
  
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Register No", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        if (!credentials?.username) return null;
        
        const student = await prisma.student.findUnique({
          where: { registerNo: credentials.username }
        });

        if (student) {
          return { 
            id: String(student.id), 
            name: student.name, 
            email: student.registerNo 
          } as any;
        }
        
        return null;
      }
    })
  ],
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }