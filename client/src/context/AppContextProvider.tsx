import { createContext, useContext, useEffect, useState } from "react";
import Loading from "../components/Loading";

type User = {
    id: string,
    email: string,
    userimg: string,
    username: string

}

interface ValueProp {
    currUser: User | undefined,
    setCurrUser: React.Dispatch<React.SetStateAction<User | undefined>>,
    loading: boolean
}

export const AppContext = createContext<ValueProp | undefined>(undefined)


export default function AppContextProvider({ children }: { children: React.ReactNode }) {
    const [currUser, setCurrUser] = useState<User|undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(true)

    const fetchUser=async()=>{
        setLoading(true);
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
        setLoading(false);
    }
    useEffect(()=>{
        fetchUser()
    },[])

    const value = {
        currUser,
        setCurrUser,
        loading,
        isAuthenticated: !!currUser
    }

    return <AppContext.Provider value={value}>
        {loading? (
            <div className="h-dvh flex justify-center items-center">
                <Loading/>
            </div>
        ) : (
            children
        )}
    </AppContext.Provider>
}


export const useAppContext = () => {
    const context = useContext(AppContext)
    if (typeof context === "undefined") {
        throw new Error("context undefined")
    }
    return context;
}