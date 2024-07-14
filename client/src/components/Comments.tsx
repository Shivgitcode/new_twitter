import { months } from "../utils";
import { VscComment } from "react-icons/vsc";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa6";
import { IoShareSocialOutline } from "react-icons/io5";
import { Comment } from "../types";
export default function Comments({ el }: { el: Comment }) {
    return (
        <section key={el.id} className="flex justify-start w-full p-[20px] border-b-[1px]">
            <div className="w-[48px] mr-2">
                <img src={el.user.userimg} alt="" className="w-full rounded-full" />
            </div>
            <div className="text-white flex flex-col gap-1">
                <div><span className="uppercase mr-1">{el.user.username}</span><span className="text-[#71767b]">@{el.user.email.slice(0, 10)} {`${months[new Date(el.timeStamp).getUTCMonth()]} ${new Date(el.timeStamp).getUTCDate()}`}</span></div>
                <h3>{el.title}</h3>
                <div className="w-[200px]">
                    <img src={el.commentimg} alt="" className="w-full" />
                </div>
                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2 text-[#71767b]">
                        <VscComment fontSize={20} fill="#71767b"></VscComment><span>0</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#71767b]">
                        <BiRepost fontSize={20} fill="#71767b"></BiRepost><span>0</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#71767b]">
                        <FaRegHeart fontSize={20} fill="#71767b"></FaRegHeart><span>0</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#71767b]">
                        <IoShareSocialOutline fontSize={20} fill="#71767b"></IoShareSocialOutline><span>0</span>
                    </div>

                </div>
            </div>

        </section>
    )
}
