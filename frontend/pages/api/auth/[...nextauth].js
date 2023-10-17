import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
    try {
        const url = `${process.env.NEXT_PUBLIC_AUTH_API_DOMAIN}/refresh-token?refresh_token=${token.refreshToken}`;
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.accessToken}`,
            },
            method: "POST",
        });

        const refreshedTokens = await response.json();

        if (!response.ok) {
            return token;
        }

        return {
            ...token,
            accessToken: refreshedTokens.access_token ?? token.accessToken,
            accessTokenExpires: refreshedTokens.expires ?? token.expires,
            refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
        };
    } catch (error) {
        console.log(error);
        return token;
    }
}

const loginUri = `${process.env.NEXT_PUBLIC_AUTH_API_DOMAIN}/login`;
export const authOptions = {
    debug: true,
    providers: [
        CredentialsProvider({
            name: "credentials",
            // eslint-disable-next-line no-unused-vars
            async authorize(credentials, req) {
                try {
                    const res = await fetch(loginUri, {
                        method: "POST",
                        body: JSON.stringify(credentials),
                        headers: { "Content-Type": "application/json" },
                    });
                    const user = await res.json();

                    if (res.ok && user) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            accessToken: user.access_token,
                            refreshToken: user.refresh_token,
                            accessTokenExpires: user.expires,
                        };
                    }
                    return null;
                } catch (error) {
                    console.log(error);
                    return null;
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: Number(process.env.JWT_EXPIRES_IN),
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.name = user.name;
                token.email = user.email;
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.accessTokenExpires = user.accessTokenExpires;

                return token;
            }

            if (Date.now() < token.accessTokenExpires) {
                return token;
            }
            return refreshAccessToken(token);
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.accessToken = token.accessToken;
            return session;
        },
        async signIn({ user, account, profile }) {
            if (account.provider === "google") {
                const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_API_DOMAIN}/social`, {
                    method: "POST",
                    body: JSON.stringify({
                        firstname: profile.given_name,
                        lastname: profile.family_name,
                        email: profile.email,
                    }),
                    headers: { "Content-Type": "application/json" },
                });
                const { access_token, refresh_token, expires } = await res.json();
                user.accessToken = access_token;
                user.refreshToken = refresh_token;
                user.accessTokenExpires = expires;
            }
            return true;
        },
    },
    pages: {
        signIn: "/login",
    },
};

export default NextAuth(authOptions);
