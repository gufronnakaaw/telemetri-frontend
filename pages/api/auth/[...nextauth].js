import axios from 'axios';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
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
        try {
          const { email, password } = credentials;

          const { data } = await axios.post(
            'http://iotindonesia.online:1414/api/auth/login',
            {
              email,
              password,
            }
          );

          return { ...data.data };
        } catch (error) {
          throw new Error(JSON.stringify(error.response.data));
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
};

export default NextAuth(authOptions);
