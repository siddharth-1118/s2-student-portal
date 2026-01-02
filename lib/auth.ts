import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAILS = [
  "saisiddharthvooka@gmail.com",
  "kothaig2@srmist.edu.in",
];

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log("🔹 Attempting sign in for:", user.email); 

      const email = user.email;
      if (!email) return false;

      // 1. Admins can always log in
      if (ADMIN_EMAILS.includes(email)) return true;

      // 2. Restrict to SRM Emails (Optional - Remove if you want personal Gmails)
      // if (account?.provider === "google" && !email.endsWith("@srmist.edu.in")) {
      //   return false;
      // }

      // 3. Automatically create/update student in DB
      const name = user.name || "Unknown Student";
      try {
        await prisma.student.upsert({
          where: { email },
          update: { name },
          create: {
            email,
            name,
            registerNo: `TEMP_${Date.now()}`, // Temporary ID until they update profile
            profileCompleted: false
          },
        });
        
        console.log("✅ Database sync successful");
        return true;
      } catch (err) {
        // --- CRITICAL FIX ---
        // We log the error but return TRUE so you can still get into the app.
        // If we returned false here, you would get stuck in the "Sign in loop".
        console.error("❌ DATABASE ERROR DURING LOGIN (Ignored to allow access):", err);
        return true; 
      }
    },
    
    async session({ session }) {
      if (!session.user?.email) return session;

      // Safe fetch for session data
      try {
        const student = await prisma.student.findUnique({
          where: { email: session.user.email },
          select: { id: true, registerNo: true, name: true }
        });

        if (student) {
          (session.user as any).studentId = student.id;
          (session.user as any).registerNo = student.registerNo;
        }
      } catch (error) {
        console.error("Error fetching session details:", error);
      }
      
      return session;
    }
  },
};