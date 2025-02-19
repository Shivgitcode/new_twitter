
import { Link, useParams } from "react-router-dom";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Comment } from "../types";
import { useDropzone } from "react-dropzone";
import { FaArrowLeft } from "react-icons/fa6";
import Comments from "./Comments";

export default function CommentPage() {
    const [file, setFile] = useState<File | undefined | string>(undefined)
    const [preview, setPreview] = useState<string | ArrayBuffer | null>("")
    const params = useParams()
    const currUser = JSON.parse(localStorage.getItem("currUser") as string)
    const [comment, setComment] = useState("")
    const [comments, setComments] = useState<Comment[] | []>([])
    const postId = params.id
    const onDrop = useCallback((acceptedFiles: File[]) => {
        console.log(acceptedFiles[0])
        setFile(acceptedFiles[0])
        const File = new FileReader();
        File.onload = function () {
            setPreview(File.result)
        }
        File.readAsDataURL(acceptedFiles[0])
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const handleTweet = (e: FormEvent) => {
        const tweetInput = e.target as HTMLInputElement
        setComment(tweetInput.value)
        console.log(comment)
    }


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const Form = new FormData();
        Form.append("title", comment)
        Form.append("imgFile", file as string)

        console.log(`${Form.get("title")} ${Form.get("imgFile")}`)
        const response = await fetch(`${import.meta.env.VITE_API_URL}/comment/${postId}`, {
            method: "POST",
            mode: "no-cors",
            credentials: "include",
            body: Form

        })
        if (response.ok) {
            const data = await response.json()
            console.log(data)
        }
        else {
            const data = await response.json()
            console.log(data)
        }
    }


    useEffect(() => {
        const fetchComments = async (id: string | undefined) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/comment/${id}`, {
                method: "GET",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }

            })
            if (response.ok) {
                const data = await response.json()
                setComments(data.data)
                console.log(data)
            }
            else {
                const data = await response.json()
                console.log(data)
            }


        }
        fetchComments(params.id)

    }, [comment])
    return (
        <div className="w-[30%] mx-auto border-[1px]">
            <div className="text-white px-[20px] py-3 cursor-pointer"><Link to={"/"}><FaArrowLeft></FaArrowLeft></Link></div>

            <form onSubmit={handleSubmit} className="w-full flex justify-between p-[20px] items-start gap-4 border-b-[1px]">

                <div className="w-[78px] h-[48px]">
                    <img src={currUser?.userimg} alt="" className="w-full h-full rounded-full" />
                </div>
                <div className="w-full">
                    <textarea name="" id="" cols={10} onChange={handleTweet} value={comment} placeholder="Tweet your reply" className="bg-transparent w-full p-2 resize-none text-white"></textarea>
                    <div {...getRootProps()} className="text-white w-full mb-2 cursor-pointer">
                        <input {...getInputProps()} className="w-full" />
                        {
                            isDragActive ?
                                <p className="w-full text-center bg-blue-400 text-[14px] bg-opacity-10">Drop the files here ...</p> :
                                <div className="h-2 w-full"></div>
                        }
                    </div>
                    <div>
                        <img src={preview as string} className=" w-[108px]" alt="" />
                    </div>
                </div>
                <button className="bg-[#308cd8] text-white px-[20px] py-[4px] rounded-2xl">
                    Tweet
                </button>
            </form>
            <div className="flex flex-col items-start justify-between">
                {comments ? comments.map(el => (
                    <Comments el={el}></Comments>
                )) : <div className="w-full p-[20px] border-b-[1px] text-[#71767b] flex justify-center ">No Comments</div>}
            </div>
        </div>

    )
}
