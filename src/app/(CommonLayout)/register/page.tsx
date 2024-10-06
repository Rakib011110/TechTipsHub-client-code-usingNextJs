"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import React from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";

import TIForm from "@/src/components/resubaleform/TIForm";
import registerValidationSchema from "@/src/schemas/registerValidationSchema";
import { useUserRegistration } from "@/src/hooks/auth.hook";
import TIInput from "@/src/components/resubaleform/TIInput";

const RegisterPage = () => {
  const {
    mutate: hanldleUserRegistration,
    data,
    isError,
    isSuccess,
    isPending,
  } = useUserRegistration();

  if (isPending) {
    ///////
  }

  // console.log({ data, isError, isSuccess, isPending });
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const userData = {
      ...data,
      profilePicture:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    };

    hanldleUserRegistration(userData);
  };

  return (
    <div className="">
      <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center">
        <h3 className="my-2 text-xl font-bold">Register with TechInsight</h3>
        <p className="mb-4">Welcom to the TechInsight Create Your acount</p>
        <div className="w-[35%]">
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
            <div className="py-3">
              <TIInput label="Name" name="name" size="sm" />
            </div>
            <div className="py-3">
              <TIInput label="Email" name="email" size="sm" />
            </div>
            <div className="py-3">
              <TIInput label="Mobile Number" name="mobileNumber" size="sm" />
            </div>
            {/* <div className="py-3">
              <TIInput label="Profile Url" name="profilePicture" size="sm" />
            </div> */}
            <div className="py-3">
              <TIInput
                label="Password"
                name="password"
                size="sm"
                type="password"
              />
            </div>

            <Button
              className="my-3 w-full rounded-md bg-default-900 text-default"
              size="lg"
              type="submit"
            >
              Registration
            </Button>
          </TIForm>
          <div className="text-center">
            Already have an account ? <Link href={"/login"}>Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
