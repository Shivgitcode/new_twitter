import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";

type User = {
    id: string,
    email: string,
    userimg: string,
    username: string

}

interface ValueProp {
    isCookie: string | undefined,
    setIsCookie: React.Dispatch<React.SetStateAction<string | undefined>>,
    currUser: User,
    setCurrUser: React.Dispatch<React.SetStateAction<User>>

}

export const AppContext = createContext<ValueProp | undefined>(undefined)


export default function AppContextProvider({ children }: { children: React.ReactNode }) {
    const [isCookie, setIsCookie] = useState<string | undefined>(Cookies.get("jwt"))
    const [currUser, setCurrUser] = useState<User>({ id: "", email: "", userimg: "", username: "" })

    const value = {
        isCookie,
        setIsCookie,
        currUser,
        setCurrUser
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}


export const useAppContext = () => {
    const context = useContext(AppContext)
    if (typeof context === "undefined") {
        throw new Error("context undefined")
    }
    return context;
}