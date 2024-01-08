import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 1 * 60 * 60, // 1 hour
  },
  secret: 'telemetrikey',
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        const { username, password } = credentials;

        if (username == 'admin' && password == 'admin') {
          return {
            email: 'admin@mail.com',
            fullname: 'Admin User',
          };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      return { ...token, ...user };
    },

    session({ session, token }) {
      session.user = token;
      return session;
    },
  },
});
