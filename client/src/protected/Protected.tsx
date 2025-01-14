import { useAppContext } from "../context/AppContextProvider";

export default function Protected({ children, fallback }: { children: React.ReactNode, fallback: React.ReactNode }) {
    const { currUser } = useAppContext();
    if(!currUser) return fallback;
    return children;
}
