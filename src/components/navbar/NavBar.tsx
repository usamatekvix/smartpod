"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  // DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useUserState from "@/store/authStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loading from "../Loading";
// import Image from "next/image";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoMdPerson } from "react-icons/io";
import { CiVideoOn } from "react-icons/ci";

export default function NavBar() {
  const { setUsername, setUsertoken, logout } = useUserState();
  const [signIn, setSignIn] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorForm, setErrorForm] = useState("");
  const [isError, setIsError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [successMessage1, setSuccessMessage1] = useState("");
  const router = useRouter();
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    // handle sign in logic here
    const payload = { email, password };
    console.log(payload);
    setLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/auth/jwt/create/",
        payload
      );
      console.log(res.data);
      // console.log("api sended");
      if (res.status === 200 && res.data.username && res.data.access) {
        setUsername(res.data.username);
        setUsertoken(res.data.access);
        setSuccessMessage1("Thank you for login.");

        setTimeout(() => {
          setSuccessMessage1(""); // Clear the success message
          router.push("/dashboard/transcription/create"); // Navigate after message disappears
        }, 3000);
      } else if (res.status === 400) {
        setErrorForm("Invalid credentials");
        setTimeout(() => {
          setErrorForm(""); // Clear the error message after 3 seconds
        }, 4000);

        logout();
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data.detail) {
          setErrorForm("Invalid credentials");
        } else {
          setIsError("An error occurred while searching. Please try again.");
        }
      } else {
        setIsError("Unknown error occurred");
      }
      setTimeout(() => {
        setErrorForm(""); // Clear the error message after 3 seconds
      }, 4000);
    } finally {
      setLoading(false);
    }
    setEmail("");
    setPassword("");
  };

  console.log(isError)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { username: name, email, password };
    console.log(payload);
    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/auth/users/",
        payload
      );

      console.log(res.data);

      if (res.status === 201) {
        setSuccessMessage(
          "Thank you for signing up. Your account has been created successfully."
        );
        setTimeout(() => {
          setSuccessMessage(""); // Clear success message after 4 seconds
        }, 4000);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;

        if (typeof errorData === "object") {
          // Extract error messages dynamically
          const errorMessages = Object.entries(errorData)
            .map(
              ([key, value]) =>
                `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
            )
            .join("\n");

          setErrorForm(errorMessages);
        } else {
          setErrorForm("An unexpected error occurred. Please try again.");
        }
      } else {
        setIsError("Unknown error occurred.");
      }

      setTimeout(() => {
        setErrorForm(""); // Clear error message after 4 seconds
      }, 5000);
    } finally {
      setLoading(false);
    }

    setName("");
    setEmail("");
    setPassword("");
    // setPhone("");
  };

  return (
    <div className="max-w-screen-xl mx-auto md:px-16 bg-gradient-to-r from-indigo-950 to-purple-900 h-16">
      <div className="flex justify-between items-center h-16">
        {/* <Image
          src={"/logo2.jpg"}
          alt="logo"
          height={60}
          width={60}
          className="rounded-full"
        /> */}
        <div className="flex items-center space-x-2 text-white">
          <span className="bg-indigo-600 rounded-md">
            <CiVideoOn size={24} />
          </span>
          <p className="font-bold text-2xl">VideoChat</p>
        </div>
        <div className="text-indigo-200">
          <ul className="flex items-center space-x-6">
            <li className="cursor-pointer hover:text-white">Features</li>
            <li className="cursor-pointer hover:text-white">Pricing</li>
            <li className="cursor-pointer hover:text-white">Documentation</li>
            <li className="cursor-pointer hover:text-white">Blog</li>
          </ul>
        </div>
        <div>
          <Dialog>
            <DialogTrigger
              onClick={() => {
                setSignIn(true);
                setSignUp(false);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-md px-3 py-[6px] font-semibold"
            >
              Sign In
            </DialogTrigger>
            {signIn && (
              <DialogContent className="bg-gradient-to-br from-indigo-900 to-purple-900 border-none border border-indigo-700">
                <DialogHeader>
                  <div className="flex flex-col items-center justify-center pt-3">
                    <div className="flex items-center space-x-2 text-white mb-4">
                      <span className="bg-indigo-600 rounded-md">
                        <CiVideoOn size={24} />
                      </span>
                      <p className="font-bold text-2xl">VideoChat</p>
                    </div>
                    <p className="text-3xl font-bold text-white">
                      Welcome Back
                    </p>
                    <p className="text-indigo-300 mt-2">
                      Sign in to your account
                    </p>
                  </div>
                  <DialogDescription>
                    <form onSubmit={handleSignIn} className="space-y-6 mt-6">
                      <div className="space-y-4">
                        <div className="relative">
                          <span className="absolute text-white top-4 right-3 cursor-pointer">
                            <MdOutlineEmail />
                          </span>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Type Your Email Here..."
                            className="w-full bg-indigo-800/70 outline-none rounded-lg px-3 py-2 mt-1 text-white placeholder:text-indigo-400 border border-indigo-600"
                            required
                          />
                        </div>
                        <div className="relative">
                          <span className="absolute top-4 right-3 text-white cursor-pointer">
                            <RiLockPasswordLine />
                          </span>
                          <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Type Your Password Here..."
                            className="w-full bg-indigo-800/70 outline-none rounded-lg px-3 py-2 mt-1 text-white placeholder:text-indigo-400 border border-indigo-600"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-lg px-3 py-2 mt-2 w-full"
                      >
                        Sign In
                      </button>
                      {loading && <Loading />}
                      <p className="text-center text-red-500">{errorForm}</p>
                      <p className="text-center text-green-500">
                        {successMessage1}
                      </p>
                    </form>
                    <div>
                      <p className="text-center text-indigo-300 mt-4">
                        Don't have an account?{" "}
                        <button
                          onClick={() => {
                            setSignIn(false);
                            setSignUp(true);
                          }}
                          className="text-indigo-600 hover:text-white/90 underline"
                        >
                          Sign Up
                        </button>
                      </p>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            )}
            {signUp && (
              <DialogContent className="bg-gradient-to-br from-indigo-900 to-purple-900 border-none border border-indigo-700">
                <DialogHeader>
                  <div className="flex flex-col items-center justify-center pt-3">
                    <div className="flex items-center space-x-2 text-white mb-4">
                      <span className="bg-indigo-600 rounded-md">
                        <CiVideoOn size={24} />
                      </span>
                      <p className="font-bold text-2xl">VideoChat</p>
                    </div>
                    <p className="text-3xl font-bold text-white">
                      Create an account
                    </p>
                    <p className="text-indigo-300 mt-2">
                      Start your journey with VideoChat
                    </p>
                  </div>
                  <DialogDescription>
                    <form onSubmit={handleSignUp} className="space-y-6 mt-6">
                      <div className="space-y-4">
                        <div className="relative">
                          <span className="absolute top-4 right-3 cursor-pointer text-white">
                            <IoMdPerson />
                          </span>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Type Your Name Here..."
                            className="w-full bg-indigo-800/70 outline-none rounded-lg px-3 py-2 mt-1 text-white placeholder:text-indigo-400 border border-indigo-600"
                            required
                          />
                        </div>

                        <div className="relative">
                          <span className="absolute text-white top-4 right-3 cursor-pointer">
                            <MdOutlineEmail />
                          </span>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Type Your Email Here..."
                            className="w-full bg-indigo-800/70 outline-none rounded-lg px-3 py-2 mt-1 text-white placeholder:text-indigo-400 border border-indigo-600"
                            required
                          />
                        </div>
                        <div className="relative">
                          <span className="absolute top-4 right-3 text-white cursor-pointer">
                            <RiLockPasswordLine />
                          </span>
                          <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Type Your Password Here..."
                            className="w-full bg-indigo-800/70 outline-none rounded-lg px-3 py-2 mt-1 text-white placeholder:text-indigo-400 border border-indigo-600"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg text-lg px-3 py-2 mt-2 w-full"
                      >
                        Sign up
                      </button>
                      {loading && <Loading />}
                      <p className="text-center text-red-500">{errorForm}</p>
                      <p className="text-center text-green-500">
                        {successMessage}
                      </p>
                    </form>
                    <div>
                      <p className="text-center mt-4 text-indigo-300">
                        Already have an account?{" "}
                        <button
                          onClick={() => {
                            setSignIn(true);
                            setSignUp(false);
                          }}
                          className="text-indigo-700 hover:text-white/90 underline"
                        >
                          Sign In
                        </button>
                      </p>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            )}
          </Dialog>
        </div>
      </div>
    </div>
  );
}
