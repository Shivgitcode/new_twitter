import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

type User = {
    id: string,
    email: string,
    userimg: string,
    username: string

}

interface ValueProp {
    currUser: User | undefined,
    setCurrUser: React.Dispatch<React.SetStateAction<User | undefined>>
    user:User | undefined
    setUser:React.Dispatch<React.SetStateAction<User|undefined>>

}

export const AppContext = createContext<ValueProp | undefined>(undefined)


export default function AppContextProvider({ children }: { children: React.ReactNode }) {
    const [currUser, setCurrUser] = useState<User|undefined>(undefined)
    const [user,setUser]=useState<User|undefined>(undefined)

    const fetchUser=async()=>{
        const response=await fetch(`${import.meta.env.VITE_API_URL}/check`,{
            method:"GET",
            credentials:"include",
            

        })
        if(response.ok){
            const data=await response.json();
            console.log(data)
            setCurrUser(data.data)

        }
        else{
            const data=await response.json();
            console.log(data)
        }
    }
    useEffect(()=>{
        fetchUser()
    },[])

    const value = {
        user,
        setUser,
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