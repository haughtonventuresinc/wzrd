import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import config from "@/config";
import clientPromise from "./mongo";
import axios from "axios";

export const authOptions = {
  // Set any random key in .env.local
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // Credentials provider for email/password authentication
    CredentialsProvider({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Email or password missing");
          return null;
        }
        
        try {
          // Use the backend API for authentication
          const BACKEND_API = "https://index-wzrdbackend-production.up.railway.app";
          
          const response = await axios.post(`${BACKEND_API}/api/v1/users/login`, {
            email: credentials.email,
            password: credentials.password
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 10000
          });
          
          if (response.data.success) {
            const userData = response.data.data;
            console.log(`User authenticated successfully: ${credentials.email}`);
            
            return {
              id: userData.id,
              email: userData.email,
              name: userData.name || credentials.email.split('@')[0],
              image: userData.image,
            };
          }
          
          console.log(`Authentication failed for: ${credentials.email}`);
          return null;
        } catch (error) {
          console.error("Error in credentials authorization:", error.response?.data || error.message);
          return null;
        }
      },
    }),
  ],
  // New users will be saved in Database (MongoDB Atlas). Each user (model) has some fields like name, email, image, etc..
  // Requires a MongoDB database. Set MONOGODB_URI env variable.
  // Learn more about the model type: https://next-auth.js.org/v3/adapters/models
  ...(clientPromise && { adapter: MongoDBAdapter(clientPromise) }),

  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      // Allow sign in if the user exists or is being created
      return true;
    },
  },
  pages: {
    // Use our custom verification page instead of the default
    verifyRequest: '/login',
    // Use our custom sign-in page
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  theme: {
    brandColor: config.colors.main,
    // Add you own logo below. Recommended size is rectangle (i.e. 200x50px) and show your logo + name.
    // It will be used in the login flow to display your logo. If you don't add it, it will look faded.
    logo: `https://${config.domainName}/logoAndName.png`,
  },
};
