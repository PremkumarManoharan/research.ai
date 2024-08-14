"use client";
import { SparklesCore } from "@/components/ui/sparkles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useStorage from "./../hooks/useStorage";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { createUser } from "@/utils/api";

export default function Home() {
  const { setItem } = useStorage();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isNameValid, setIsNameValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Get Started for Free! 👋");

  const router = useRouter();

  const handleOnchangeEmail = (e: React.FormEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
    let regexp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    regexp.test(e.currentTarget.value)
      ? setIsEmailValid(false)
      : setIsEmailValid(true);
  };
  const handleOnchangeName = (e: React.FormEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
    if (e.currentTarget.value.length < 3) {
      setIsNameValid(true);
    } else {
      setIsNameValid(false);
    }
  };

  const handleOnClick = async () => {
    setIsLoading(true);
    setButtonText("Creating your workspace...");
    setItem("email", email, "session");
    await createUser(email, name);
    router.push("/dashboard");
    setIsLoading(false);
    setButtonText("Get Started for Free! 👋");
  };

  return (
    <div className="bg-black">
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md col-span-4">
        <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
          Research.ai
        </h1>

        {/* <p className="text-slate-300 mb-1">
          Research.ai: Transforming Reading into Understanding with AI
          Precision. */}
        <TextGenerateEffect
          duration={0.5}
          filter={true}
          words={"Transforming Reading into Understanding with AI Precision"}
        />
        {/* </p> */}
        <div className="w-[40rem] h-40 relative">
          {/* Gradients */}
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
          {/* Core component */}
          <SparklesCore
            background="transparent"
            minSize={0.4}
            maxSize={1}
            particleDensity={1200}
            className="w-full h-full"
            particleColor="#FFFFFF"
          />
          {/* Radial Gradient to prevent sharp edges */}
          <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
        </div>

        <Input placeholder="John Doe" onChange={handleOnchangeName} />

        <Input
          placeholder="john.doe@example.com"
          onChange={handleOnchangeEmail}
        />

        <Button
          disabled={isEmailValid || isNameValid || isLoading}
          variant="secondary"
          size="lg"
          className="mt-2 w-[20%]"
          onClick={handleOnClick}
        >
          {buttonText}
        </Button>
        <div />
      </div>
    </div>
  );
}
