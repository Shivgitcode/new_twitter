import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContextProvider";

export default function Protected({ Component }: { Component: React.FC }) {
    const { currUser } = useAppContext();
    const navigate = useNavigate()

    console.log("hello",currUser)


    useEffect(() => {

        if (!currUser) {

            navigate("/login")
        }
    })
    return (
        <Component></Component>
    )
}
