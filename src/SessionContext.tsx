import {Session} from "./types";
import React, {createContext, ReactNode, useContext, useState} from "react";

interface SessionContextProps {
    session: Session | null;
    setSession: React.Dispatch<React.SetStateAction<Session | null>>;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

interface SessionProviderProps {
    children: ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);

    return (
        <SessionContext.Provider value={{ session, setSession }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = (): SessionContextProps => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};
