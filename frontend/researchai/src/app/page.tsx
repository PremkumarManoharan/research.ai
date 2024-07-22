"use client";
import { SparklesCore } from "@/components/ui/sparkles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useStorage from "./../hooks/useStorage";

export default function Home() {
  const { setItem } = useStorage();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  let email = "";
  const router = useRouter();

  const handleOnchange = (e: React.FormEvent<HTMLInputElement>) => {
    let regexp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    regexp.test(e.currentTarget.value)
      ? setIsButtonDisabled(false)
      : setIsButtonDisabled(true);
    email = e.currentTarget.value;
  };

  const handleOnClick = () => {
    router.push("/dashboard");
    setItem("email", email, "session");
  };

  return (
    <div className="bg-black">
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
        <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
          Research.ai
        </h1>
        <p className="text-slate-300 mb-1">
          Research.ai: Transforming Reading into Understanding with AI
          Precision.
        </p>
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
        <Input onChange={handleOnchange} width="20%" />

        <Button
          disabled={isButtonDisabled}
          variant="secondary"
          size="lg"
          onClick={handleOnClick}
        >
          Get Started for Free! 👋
        </Button>
        <div />
      </div>
    </div>
  );
}
