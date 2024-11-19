import { useState } from "react";
import { FaEye, FaEyeLowVision } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner";


export default function SignupPage() {
    const [hidePass, setHidePass] = useState(true)
    const navigate = useNavigate()
    const signUpSchema = z.object({
        email: z.string().email().endsWith("gmail.com"),
        username: z.string(),
        file: z.any(),
        password: z.string().min(4).max(20)



    })
    type Form = z.infer<typeof signUpSchema>
    let newForm = new FormData()
    const { register, handleSubmit, formState: { errors } } = useForm<Form>({ resolver: zodResolver(signUpSchema) })
    const submitForm = async (data: Form) => {
        console.log(data)
        newForm.append("email", data.email)
        newForm.append("username", data.username)
        newForm.append("imgFile", data.file[0])
        newForm.append("password", data.password)

        console.log(newForm.get("imgFile"))
        const response = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
            method: "POST",
            credentials: "include",
            body: newForm
        })
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            navigate("/login")
            toast.success(data.message)

        }
        else {
            const data = await response.json();
            toast.error(data.message)
            console.log(data)
        }
    }

    return (
        <div>
            <div className="w-[400px]">
                <div
                    style={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                    className="bg-gray-800 rounded-lg shadow-xl overflow-hidden"
                >
                    <div className="p-8">
                        <h2 className="text-center text-3xl font-extrabold text-white">
                            Sign Up First !
                        </h2>
                        <p className="mt-4 text-center text-gray-400">Sign up to continue</p>
                        <form onSubmit={handleSubmit(submitForm)} className="mt-8 space-y-6" noValidate>
                            <div className="rounded-md shadow-sm">
                                <div>
                                    <label className="sr-only" htmlFor="email">Email address</label>
                                    <input
                                        placeholder="Email address"
                                        className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        autoComplete="none"

                                        type="email"
                                        {...register("email")}
                                        id="email"
                                    />
                                    {errors.email && <span className=" text-red-600">{errors.email.message}</span>}
                                </div>
                                <div className=" mt-4">
                                    <label className="sr-only" htmlFor="username">Username</label>
                                    <input
                                        placeholder="Username"
                                        className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        autoComplete="none"


                                        type="text"
                                        {...register("username")}
                                        id="username"
                                    />
                                    {errors.username && <span className=" text-red-600">{errors.username.message}</span>}
                                </div>
                                <div className=" mt-4">
                                    <label className="sr-only" htmlFor="file">Profile</label>
                                    <input
                                        placeholder="profile"
                                        className="appearance-none  relative block w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        {...register("file")}
                                        id="profile"

                                        type="file"
                                    />
                                </div>
                                <div className="mt-4 relative">
                                    <label className="sr-only" htmlFor="password">Password</label>
                                    <input
                                        placeholder="Password"
                                        className="appearance-none relative block w-full px-3 py-3 border border-gray-700 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        {...register("password")}
                                        type={hidePass ? "password" : "text"}
                                        id="password"
                                    />
                                    <div className="absolute text-white right-4 top-4 z-10" onClick={() => setHidePass(!hidePass)}>
                                        {hidePass ? <FaEye></FaEye> : <FaEyeLowVision></FaEyeLowVision>}
                                    </div>
                                    {errors.password && <span className=" text-red-600">{errors.password.message}</span>}
                                </div>
                            </div>



                            <div>
                                <button
                                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"

                                >
                                    Sign In
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="px-8 py-4 bg-gray-700 text-center">
                        <span className="text-gray-400">Already have an account ?</span>
                        <Link className="font-medium text-indigo-500 hover:text-indigo-400" to={"/login"}>Login</Link>
                    </div>
                </div>
            </div>

        </div>
    )
}
