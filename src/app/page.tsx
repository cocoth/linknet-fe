"use client"

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { Login } from "@/types/type";
import Image from "next/image";
import { HandleLogin } from "@/lib/be-login";

export default function Home() {
  const [login, setLogin] = useState<Login>({
    emailphone: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")

  const handleLogin = async () => {
    startTransition(async () => {
      const result = await HandleLogin(login.emailphone, login.password);
      if (result.status === "Ok") {
        setIsLogin(true);
        setMessage("Logging in");
        window.location.href = "/dashboard";
      } else {
        setIsLogin(false);
        setMessage(result.message || "Login failed");
      }
    });
  }
  return (
    <div className="flex flex-col md:flex-row md:justify-center  items-center min-h-screen bg-gradient-to-b from-yellow-600 to-slate-300 p-4">
      <section className="flex mx-3 h-full  md:mr-10">
        <Image
          src="/logo.png"
          alt="SIDASI"
          width={500}
          height={500}
          className="text-center text-3xl md:text-7xl  font-bold text-gray-800 mb-4"
        />
      </section>
      <section>

      </section>
      <Card className="flex w-full max-w-md p-8 shadow-xl shadow-black">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="emailphone">Email / Phone</Label>
            <Input
              id="emailphone"
              type="text"
              placeholder="Enter your email / phone"
              value={login.emailphone}
              onChange={(e) =>
                setLogin((prev) => ({ ...prev, emailphone: e.target.value }))
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={login.password}
              onChange={(e) => setLogin((prev) => ({ ...prev, password: e.target.value }))}
              className="mt-1"
            />
          </div>
          {!isLogin && <p className="flex justify-center content-center w-full h-max rounded-md bg-red-500 text-white text-center">{message}</p>}
          {isLogin && <p className="flex justify-center content-center w-full h-max rounded-md bg-green-500 text-white text-center">{message}</p>}
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
}
