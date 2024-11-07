import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContextProvider";

export default function Protected({ Component }: { Component: React.FC }) {
    const { isCookie } = useAppContext();
    const navigate = useNavigate()


    useEffect(() => {

        if (typeof isCookie === "undefined") {

            navigate("/login")
        }
    })
    return (
        <Component></Component>
    )
}
