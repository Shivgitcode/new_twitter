import { Link, useNavigate } from "react-router-dom";
import { ZodType, z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FaEye } from "react-icons/fa6";
import { FaEyeLowVision } from "react-icons/fa6";
import { useState } from "react";
import Cookies from "js-cookie"
import { useAppContext } from "../context/AppContextProvider";




type User = {
    email: string,
    password: string
}
export default function LoginPage() {
    const { setIsCookie } = useAppContext()
    const navigate = useNavigate()
    const schema: ZodType<User> = z.object({
        email: z.string().email().endsWith("gmail.com"),
        password: z.string().min(4).max(20)
    })
    const [hidePass, setHidePass] = useState(true)
    // type FormData = z.infer<typeof schema>

    const { register, handleSubmit, formState: { errors } } = useForm<User>({ resolver: zodResolver(schema) })


    const submitHandler = async (data: User) => {
        console.log("It worked", data)


        const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
            method: "POST",
            mode: "no-cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)

        })
        if (response.ok) {
            const data = await response.json();
            setIsCookie(Cookies.get("jwt"))
            localStorage.setItem("currUser", JSON.stringify(data.data))
            navigate("/")



            console.log(data)
        }
        else {
            const data = await response.json();
            console.log(data)
        }



    }




    return (
        <div>
            <div className="max-w-lg w-[350px]">
                <div
                    style={{ "boxShadow": "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);" }}
                    className="bg-gray-800 rounded-lg shadow-xl overflow-hidden"
                >
                    <div className="p-8">
                        <h2 className="text-center text-3xl font-extrabold text-white">
                            Welcome Back
                        </h2>
                        <p className="mt-4 text-center text-gray-400">Sign in to continue</p>
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit(submitHandler)}>
                            <div className="rounded-md shadow-sm">
                                <div>
                                    <label className="sr-only" htmlFor="email">Email address</label>
                                    <input
                                        placeholder="Email address"
                                        className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"

                                        {...register("email")}

                                        type="email"
                                        name="email"
                                        id="email"
                                    />
                                    {errors.email && <span>{errors.email.message}</span>}
                                </div>
                                <div className="mt-4 relative">
                                    <label className="sr-only" htmlFor="password">Password</label>
                                    <input
                                        placeholder="Password"
                                        className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"

                                        type={hidePass ? "password" : "text"}
                                        autoComplete="none"
                                        id="password"
                                        {...register("password")}
                                    />
                                    <div onClick={() => setHidePass(!hidePass)} className="text-white absolute right-4 z-[10] top-4">
                                        {hidePass ? <FaEye></FaEye> : <FaEyeLowVision></FaEyeLowVision>}
                                    </div>
                                    {errors.password && <span>{errors.password.message}</span>}

                                </div>
                            </div>



                            <div>
                                <button
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    type="submit"

                                >
                                    Log In
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="px-8 py-4 bg-gray-700 text-center">
                        <span className="text-gray-400">Don't have an account?</span>
                        <Link className="font-medium text-indigo-500 hover:text-indigo-400" to={"/signup"}>Sign up</Link>
                    </div>
                </div>
            </div>

        </div>
    )
}
