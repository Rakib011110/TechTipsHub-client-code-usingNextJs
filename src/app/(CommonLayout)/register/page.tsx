"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import React, { useEffect } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

import TIForm from "@/src/components/resubaleform/TIForm";
import registerValidationSchema from "@/src/schemas/registerValidationSchema";
import { useUserRegistration } from "@/src/hooks/auth.hook";
import TIInput from "@/src/components/resubaleform/TIInput";

const RegisterPage = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const router = useRouter();

  const {
    mutate: hanldleUserRegistration,
    isSuccess,
    isPending,
  } = useUserRegistration();

  useEffect(() => {
    if (!isPending && isSuccess) {
      if (redirect) {
        router.push(redirect);
      } else {
        router.push("/");
      }
    }
  }, [isPending, isSuccess]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const userData = {
      ...data,
      profilePicture:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    };

    hanldleUserRegistration(userData);
  };

  return (
    <div className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 h-screen flex justify-center items-center">
      <div className="shadow-xl rounded-lg p-8 bg-white w-[90%] max-w-[500px]">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Join TechInsight
        </h3>
        <p className="text-center text-gray-600 mb-8">
          Create your account and get started!
        </p>
        <TIForm
          //! Only for development
          defaultValues={{
            name: "Sadiya Islam",
            email: "sadiya@gmail.com",
            mobileNumber: "01700000000",
            password: "123456",
          }}
          resolver={zodResolver(registerValidationSchema)}
          onSubmit={onSubmit}
        >
          <div className="mb-5 w-full px-4 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <TIInput name="name" placeholder="Enter your name" size="sm" />
          </div>
          <div className="mb-5 w-full px-4 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <TIInput name="email" placeholder="Enter your email" size="sm" />
          </div>
          <div className="mb-5 w-full px-4 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <TIInput
              name="mobileNumber"
              placeholder="Enter your mobile number"
              size="sm"
            />
          </div>
          <div className="mb-6 w-full px-4 py-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <TIInput
              name="password"
              placeholder="Enter your password"
              size="sm"
              type="password"
            />
          </div>

          <Button
            className="my-4 w-full rounded-md bg-blue-600 text-white font-semibold text-lg py-2 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg focus:outline-none"
            size="lg"
            type="submit"
          >
            Register
          </Button>
        </TIForm>
        <div className="text-center mt-4">
          <span className="text-gray-600">Already have an account?</span>{" "}
          <Link className="text-blue-600 hover:underline" href="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
