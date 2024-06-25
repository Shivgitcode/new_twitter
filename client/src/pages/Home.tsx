// import { comments } from "../utils";
import { VscComment } from "react-icons/vsc";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa6";
import { IoShareSocialOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Post } from "../types";
import { months } from "../utils";
import { Link, useNavigate } from "react-router-dom";



export default function Home() {
    const port = import.meta.env.VITE_BASE_URL
    const [tweet, setTweet] = useState<string>("")
    const [comments, setComments] = useState<Post[] | []>([])
    const currUser = JSON.parse(localStorage.getItem("currUser") as string)
    const [File, setFile] = useState<File | undefined | string>(undefined)
    const [preview, setPreview] = useState<ArrayBuffer | string | null>("")
    const navigate = useNavigate()
    const onDrop = useCallback((acceptedFiles: File[]) => {
        console.log(acceptedFiles[0])
        setFile(acceptedFiles[0])
        const file = new FileReader()
        file.onload = function () {
            setPreview(file.result)

        }
        file.readAsDataURL(acceptedFiles[0])



    }, [])


    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
    useEffect(() => {
        const getData = async () => {
            const response = await fetch(`${port}/api/v1/post`, {
                method: "GET",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (response.ok) {
                const data = await response.json();
                setComments(data.data)
                const date = new Date("2024-06-17T03:13:12.927Z")
                console.log(data)
                console.log(date)

            }
            else {
                const data = await response.json();
                console.log(data)
            }
        }
        getData()

    }, [tweet])



    const tweetHandler = (e: React.FormEvent) => {
        const inputEvent = e.target as HTMLInputElement
        setTweet(inputEvent.value)
        console.log(tweet)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const form = new FormData();
        form.append("title", tweet);
        form.append("imgFile", File as string);

        console.log(`this is my value ${form.get("post")} ${form.get("imgFile")}`)

        const submitForm = async () => {
            const response = await fetch(`${port}/api/v1/post`, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                body: form

            })
            if (response.ok) {
                const data = await response.json();

                console.log(data);
            }
            else {
                const data = await response.json();
                console.log(data);

            }
        }

        submitForm()
        setTweet("")
        setPreview("")


    }


    const handleLogout = async () => {
        const response = await fetch(`${port}/api/v1/logout`, {
            method: "POST",
            mode: "cors",
            credentials: "include"
        })
        if (response.ok) {
            const data = await response.json();
            console.log(data)
            navigate("/login")

        }
        else {
            const data = await response.json();
            console.log(data)
        }


    }
    return (
        <div className=" w-full h-full">
            <section className=" w-[30%] mx-auto border-[0.2px] border-b-0 border-[#e7e9ea9f]">
                <div className="flex flex-col items-start border-b-[0.5px]">
                    <h1 className="text-white text-[18px] font-bold leading-7 p-[16px] w-full">Home</h1>
                    <form className="w-full p-[16px]" onSubmit={handleSubmit}>
                        <div className="flex justify-start items-start w-full">
                            <div className="w-[58px] mr-[8px]">
                                <img src={currUser?.userimg} alt="" className=" rounded-full w-full " />
                            </div>
                            <div className="w-full flex flex-col ">
                                <textarea name="comment" placeholder="What's happening" onChange={tweetHandler} cols={10} value={tweet} rows={3} className=" bg-transparent text-white w-full p-[8px] placeholder:text-[#e7e9ea9f] focus:outline-none"></textarea>
                                <div {...getRootProps()} className="text-white w-full mb-2">
                                    <input {...getInputProps()} className="w-full" />
                                    {
                                        isDragActive ?
                                            <p className="w-full">Drop the files here ...</p> :
                                            <div className="h-2 w-full"></div>
                                    }
                                </div>
                                <div className={`w-[108px] ${preview && "min-h-3"} mb-1`}><img src={preview as string} alt="" /></div>
                                <div className=" w-full h-[1px] bg-[#e7e9ea9f]"></div>
                            </div>


                        </div>
                        <div className="w-full flex justify-end py-2">
                            <button className=" text-white rounded-3xl px-[20px] py-[4px] bg-[#308cd8] ml-auto">Tweet</button>
                        </div>
                    </form>

                </div>
                <div className="flex flex-col items-start">
                    {comments?.map(el => (
                        <div key={el.id} className="flex justify-start items-start w-full border-b-[1px] p-[20px]">
                            <div className="w-[48px] mr-[8px]">
                                <img src={el.user.userimg} alt="" className=" rounded-full " />
                            </div>
                            <div>
                                <div className=" text-white">
                                    <span className="uppercase mr-[4px]">{el.user.username}</span><span className=" text-[#71767b]">@{el.user.email.slice(0, 10)} {`${months[new Date(el.timeStamp).getUTCMonth()]} ${new Date(el.timeStamp).getUTCDate()}`}</span>
                                </div>
                                <div className="flex flex-col items-start text-white gap-1">
                                    <h3>{el.title}</h3>
                                    <div className="w-[200px]">
                                        <img src={el.postimg} alt="" className="m-[4px]" />
                                    </div>
                                </div>
                                <div className="flex w-full justify-between mt-3">
                                    <div className="mr-[4px] text-[#71767b]">
                                        <Link to={`/comment/${el.id}`} className="flex items-center gap-1"><VscComment fill="white"></VscComment><span>{el.comments.length}</span>
                                        </Link>
                                    </div>
                                    <div className="mr-[4px] text-[#71767b] flex items-center justify-center gap-1">
                                        <BiRepost fill="white"></BiRepost><span>0</span>
                                    </div>
                                    <div className="mr-[4px] text-[#71767b] flex items-center justify-center gap-1">
                                        <FaRegHeart fill="white"></FaRegHeart><span>{el.likes}</span>
                                    </div>
                                    <div className="mr-[4px] text-[#71767b] flex items-center justify-center gap-1">
                                        <IoShareSocialOutline stroke="white"></IoShareSocialOutline><span>0</span>
                                    </div>
                                </div>

                            </div>



                        </div>
                    ))}
                </div>



            </section>
            <div className="w-full flex justify-center">
                <button className="py-[10px] px-[20px] rounded-full bg-white  my-3" onClick={handleLogout}>logout</button>
            </div>

        </div>
    )
}
