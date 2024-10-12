"use client";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import React, { useEffect } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";

import TIForm from "@/src/components/resubaleform/TIForm";
import { loginValidationSchema } from "@/src/schemas/login.schema";
import { useUserLogin } from "@/src/hooks/auth.hook";
import Loading from "@/src/components/UI/Loading/Loading";
import { useUser } from "@/src/context/user.provider";
import TIInput from "@/src/components/resubaleform/TIInput";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const { setIsLoading: userIsloading } = useUser();
  const router = useRouter();
  const redirect = searchParams.get("redirect");
  const { mutate: handleUserLogin, isPending, isSuccess } = useUserLogin();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    handleUserLogin(data);
    userIsloading(true);
  };

  useEffect(() => {
    if (!isPending && isSuccess) {
      if (redirect) {
        router.push(redirect);
      } else {
        router.push("/");
      }
    }
  }, [isPending, isSuccess]);

  return (
    <>
      {isPending && <Loading />}
      <div className="flex h-[calc(100vh-200px)] w-full flex-col items-center justify-center  via-gray-300 to-gray-100">
        <div className="shadow-lg rounded-lg p-8 bg-white w-[90%] max-w-[500px]">
          <h3 className="my-4 text-3xl font-bold text-gray-900 text-center">
            Welcome to TechInsight
          </h3>
          <p className="mb-6 text-center text-gray-600">
            Sign in to your account
          </p>
          <TIForm
            resolver={zodResolver(loginValidationSchema)}
            onSubmit={onSubmit}
          >
            <div className="w-full mb-5 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
              <TIInput name="email" placeholder="Email" type="email" />
            </div>
            <div className="w-full mb-5 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
              <TIInput name="password" placeholder="Password" type="password" />
            </div>

            <Button
              className="my-4 w-full rounded-md bg-blue-600 text-white font-semibold text-lg py-2 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg focus:outline-none"
              size="lg"
              type="submit"
            >
              Login
            </Button>
          </TIForm>
          <div className="text-center mt-4">
            <span className="text-gray-600"> Do not have an account?</span>{" "}
            <Link className="text-blue-600 hover:underline" href="/register">
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
