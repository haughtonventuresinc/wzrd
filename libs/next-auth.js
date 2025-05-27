import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import nodemailer from "nodemailer";
import config from "@/config";
import clientPromise from "./mongo";

export const authOptions = {
  // Set any random key in .env.local
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // Credentials provider for direct login with any email from the database
    CredentialsProvider({
      id: "credentials",
      name: "Email Login",
      credentials: {
        email: { label: "Email", type: "email" }
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          console.log("No email provided");
          return null;
        }
        
        try {
          // Get the MongoDB client
          const client = await clientPromise;
          const db = client.db();
          const usersCollection = db.collection('users');
          
          // Check if user exists
          const email = credentials.email;
          let user = await usersCollection.findOne({ email });
          
          if (!user) {
            console.log(`User not found with email: ${email}`);
            return null;
          }
          
          console.log(`Found existing user in MongoDB: ${email}`);
          
          return {
            id: user._id?.toString() || user.id,
            email: user.email,
            name: user.name || email.split('@')[0],
            image: user.image,
          };
        } catch (error) {
          console.error("Error in credentials authorization:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      // Follow the "Login with Google" tutorial to get your credentials
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.given_name ? profile.given_name : profile.name,
          email: profile.email,
          image: profile.picture,
          createdAt: new Date(),
        };
      },
    }),
    // Using Resend for email authentication with verification code
    // Requires a MongoDB database. Set MONOGODB_URI env variable.
    ...(clientPromise
      ? [
          EmailProvider({
            // Extract the Resend API key from the EMAIL_SERVER environment variable
            // or use the dedicated RESEND_API_KEY if available
            server: {
              host: "smtp.resend.com",
              port: 465,
              auth: {
                user: "resend",
                // Get the API key from the environment variable
                pass: process.env.EMAIL_SERVER?.replace("RESEND_API_KEY=", "") || process.env.RESEND_API_KEY,
              },
              secure: true,
            },
            from: process.env.EMAIL_FROM || "onboarding@resend.dev",
            // Generate a 6-digit verification code instead of using magic links
            generateVerificationToken: async () => {
              // Generate a random 6-digit code
              return Math.floor(100000 + Math.random() * 900000).toString();
            },
            // Custom email template with the verification code
            sendVerificationRequest: async ({ identifier, url, provider, token }) => {
              // Create a transport using the provider's server configuration
              const { server, from } = provider;
              const transport = nodemailer.createTransport(server);
              
              // The verification code is the token
              const verificationCode = token;
              
              // Email subject
              const subject = `Your verification code: ${verificationCode}`;
              
              // Email text body - simple text with the code
              const text = `Your verification code is: ${verificationCode}\n\nThis code will expire in 10 minutes.`;
              
              // Email HTML body - a bit more styled
              const html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2>Your Verification Code</h2>
                  <p>Use the following code to complete your sign-in:</p>
                  <div style="background-color: #f4f4f4; padding: 12px; font-size: 24px; letter-spacing: 2px; text-align: center; margin: 20px 0; font-weight: bold;">
                    ${verificationCode}
                  </div>
                  <p>This code will expire in 10 minutes.</p>
                </div>
              `;
              
              // Send the email
              await transport.sendMail({
                to: identifier,
                from,
                subject,
                text,
                html,
              });
            },
          }),
        ]
      : []),
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
