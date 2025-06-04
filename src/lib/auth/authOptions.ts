import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { NextAuthOptions } from "next-auth";
import { checkMongodbConnection } from "@/lib/db/checkMongodbConnection";
import { User } from "@/models/User";
import { AuthProvider } from "@/types/user";

declare module "next-auth" {
	interface Session {
		user: {
			_id: string;
			email: string;
			provider: AuthProvider;
			name?: string | null;
			image?: string | null;
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
			await checkMongodbConnection();

			// Ensure email and provider exists in session before querying the database
			if (!session.user?.email || !token.provider) {
				console.error(
					`Missing email or provider in session or token. Email: ${session.user?.email}, Provider: ${token.provider}`
				);
				throw new Error("Invalid session: missing email or provider.");
			}

			// Find the user in the database by email and provider
			const dbUser = (await User.findOne({
				email: session.user.email,
				provider: token.provider, // Use provider from the token
			})) as { _id: string; provider: string } | null;

			if (!dbUser) {
				console.error("User not found in database.");
				throw new Error("Invalid session: user not found.");
			}

			// Add user id and provider to session
			session.user._id = dbUser._id.toString();
			session.user.provider = dbUser.provider as AuthProvider;

			return session;
		},
		// SignIn callback to add user to the database
		async signIn({ user, account }) {
			if (!user.email || !account?.provider) {
				console.error("Sign-in attempt failed: Missing email or provider.");
				return false;
			}

			await checkMongodbConnection();

			// Cast the provider to enum
			const provider = account.provider as AuthProvider;

			// Check if a user with the same email and provider already exists
			const existingUser = await User.findOne({
				email: user.email,
				provider: provider,
			});

			// If the user doesn't exist, create a new one
			if (!existingUser) {
				const newUser = new User({
					name: user.name,
					email: user.email,
					image: user.image,
					provider: provider,
				});
				await newUser.save();
			}

			return true;
		},
	},
	secret: nextAuthSecret!,
};
