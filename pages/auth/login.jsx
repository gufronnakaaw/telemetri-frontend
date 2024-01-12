import { Button } from '@material-tailwind/react';
import Head from 'next/head';
import Image from 'next/image';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function Login() {
  const [type, setType] = useState('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [disabled, setDisabled] = useState(true);

  function handleLogin() {
    if (email == '' || password == '') return;

    signIn('credentials', {
      email,
      password,
      callbackUrl: '/',
    });
  }

  return (
    <>
      <Head>
        <title>Login Page</title>
      </Head>

      <div className="flex h-screen">
        <div className="h-full w-2/4 relative">
          <Image
            src="/images/bendungan.jpg"
            alt="image login"
            className="h-full object-cover"
            fill={true}
            priority={true}
          />
        </div>

        <div className="h-full w-2/4 flex justify-center items-center">
          <div className="flex flex-col gap-2 w-[450px] text-center p-12">
            <h1 className="font-bold text-3xl mb-5">
              Selamat Datang di Aplikasi Telemetri
            </h1>

            <input
              type="text"
              placeholder="Email"
              className="flex h-[52px] w-full rounded-md bg-gray-200 px-6 text-base text-gray-900 outline-none placeholder:text-[14px] placeholder:font-semibold placeholder:text-gray-600 focus:border focus:border-green-400 focus:ring-4 focus:ring-green-400/20"
              name="email"
              onChange={(e) => {
                setEmail(e.target.value);
                if (e.target.value == '' || password == '') {
                  setDisabled(true);
                } else {
                  setDisabled(false);
                }
              }}
              autoComplete="off"
            />

            <div className="relative flex w-full items-center">
              <input
                type={type}
                placeholder="Password"
                className="flex h-[52px] w-full rounded-md bg-gray-200 px-6 text-base text-gray-900 outline-none placeholder:text-[14px] placeholder:font-semibold placeholder:text-gray-600 focus:border focus:border-green-400 focus:ring-4 focus:ring-green-400/20"
                name="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (e.target.value == '' || email == '') {
                    setDisabled(true);
                  } else {
                    setDisabled(false);
                  }
                }}
                autoComplete="off"
              />

              <div
                className="absolute right-6 cursor-pointer rounded-lg p-1 text-[1.3rem] text-gray-600 hover:bg-gray-300 dark:hover:bg-gray-800"
                onClick={() => {
                  if (type == 'password') {
                    setType('text');
                  } else {
                    setType('password');
                  }
                }}
              >
                {type == 'password' ? <HiOutlineEye /> : <HiOutlineEyeOff />}
              </div>
            </div>

            <Button
              className="bg-green-400"
              size="lg"
              onClick={handleLogin}
              disabled={disabled}
            >
              Login
            </Button>

            <p className="mt-4 text-sm">Copyright {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </>
  );
}
