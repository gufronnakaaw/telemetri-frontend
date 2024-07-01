import { Button, Input, Spinner } from '@material-tailwind/react';
import { signIn } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Toast from 'react-hot-toast';
import { HiKey, HiOutlineMail } from 'react-icons/hi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

  async function handleLogin() {
    if (email == '' || password == '') return;

    setLoading(true);
    setDisabled(true);

    const { ok, error } = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);
    setDisabled(false);

    if (error) {
      const { errors } = JSON.parse(error);

      errors.forEach(({ message }) => {
        Toast.error(message, {
          position: 'top-right',
        });
      });
    }

    if (ok) {
      return router.push('/');
    }
  }

  return (
    <>
      <Head>
        <title>Login Page</title>
      </Head>

      <div className="flex h-screen justify-center items-center bg-[#fafafa]">
        <div className="w-[375px] h-[325px] md:w-[400px] md:h-[350px] bg-white rounded-xl border-2 p-8 text-center flex flex-col gap-5">
          <h1 className="font-bold text-xl">
            Selamat Datang Di Aplikasi Telemetri
          </h1>

          <Input
            label="Email"
            icon={<HiOutlineMail />}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            icon={<HiKey />}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            className="bg-custom-gray-one capitalize flex justify-center items-center tracking-wider font-semibold"
            onClick={handleLogin}
            disabled={disabled}
            size="md"
          >
            {!loading ? 'Login' : <Spinner className="h-4 w-4" />}
          </Button>
        </div>
        <p className="absolute bottom-4 text-center">
          PT. RODA HARAPAN SEMESTA
        </p>
      </div>
    </>
  );
}
