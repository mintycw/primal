import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { NextAuthOptions } from "next-auth";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/models/User";

declare module "next-auth" {
	interface Session {
		user: {
			_id?: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
			provider?: string | null;
		};
	}
}

// Error handling for enviromment variables
const googleClientId = process.env.GOOGLE_CLIENT_ID as string;
if (!googleClientId) {
	throw new Error("Please define the GOOGLE_CLIENT_ID environment variable.");
}

const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
if (!googleClientSecret) {
	throw new Error("Please define the GOOGLE_CLIENT_SECRET environment variable.");
}

const discordClientId = process.env.DISCORD_CLIENT_ID as string;
if (!discordClientId) {
	throw new Error("Please define the DISCORD_CLIENT_ID environment variable.");
}

const discordClientSecret = process.env.DISCORD_CLIENT_SECRET as string;
if (!discordClientSecret) {
	throw new Error("Please define the DISCORD_CLIENT_SECRET environment variable.");
}

const nextAuthSecret = process.env.NEXTAUTH_SECRET as string;
if (!nextAuthSecret) {
	throw new Error("Please define the NEXTAUTH_SECRET environment variable.");
}

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: googleClientId!,
			clientSecret: googleClientSecret!,
		}),
		DiscordProvider({
			clientId: discordClientId!,
			clientSecret: discordClientSecret!,
		}),
	],
	callbacks: {
		// Add provider to JWT
		async jwt({ token, user, account }) {
			if (user && account) {
				// Add provider to the token during sign-in
				token.provider = account.provider;
			}
			return token;
		},
		// Handle session and add provider and _id to the session object
		async session({ session, token }) {
			await connectToDatabase();

			console.log(session, token);

			// Ensure email exists in session before querying the database
			if (!session.user?.email) {
				console.error("No email in session.");
				return session;
			}

			// Find the user in the database by email and provider
			const dbUser = (await User.findOne({
				email: session.user.email,
				provider: token.provider, // Use provider from the token
			})) as { _id: string; provider: string } | null;

			// If a matching user is found, add _id and provider to session.user
			if (dbUser && session.user) {
				session.user._id = dbUser._id.toString();
				session.user.provider = dbUser.provider;
			} else {
				console.error("User not found in the database.");
			}

			return session;
		},
		// SignIn callback to add user to the database
		async signIn({ user, account }) {
			if (!user.email || !account?.provider) {
				console.error("Sign-in attempt failed: Missing email or provider.");
				return false;
			}

			await connectToDatabase();

			// Check if a user with the same email and provider already exists
			const existingUser = await User.findOne({
				email: user.email,
				provider: account.provider,
			});

			// If the user doesn't exist, create a new one
			if (!existingUser) {
				const newUser = new User({
					name: user.name,
					email: user.email,
					image: user.image,
					provider: account.provider,
				});
				await newUser.save();
			}

			return true;
		},
	},
	secret: nextAuthSecret!,
};
