import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";

const loginUri = `${process.env.API_DOMAIN}/auth/login`;
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
                            firstname: user.firstname,
                            lastname: user.lastname,
                            phone: user.phone,
                        };
                    }
                    return null;
                } catch (error) {
                    console.log( error)
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: Number(process.env.JWT_EXPIRES_IN),
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.firstname = user.firstname;
                token.lastname = user.lastname;
                token.phone = user.phone;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.sub;
            session.user.firstname = token.firstname;
            session.user.lastname = token.lastname;
            session.user.phone = token.phone;
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
};

export default NextAuth(authOptions);
