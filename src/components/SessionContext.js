// SessionContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from './lib/Supabase';  // Asegúrate de que la ruta es correcta

const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
    const [session, setSession] = useState(null);

    useEffect(() => {
        setSession(supabase.auth.session());

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            listener.unsubscribe();
        };
    }, []);

    return (
        <SessionContext.Provider value={{ session, setSession }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);
