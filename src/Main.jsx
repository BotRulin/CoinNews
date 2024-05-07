import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { supabase } from './lib/Supabase';
import Auth from './components/Auth';
import { View } from 'react-native';
import { Session } from '@supabase/supabase-js';
import Account from "./components/Account";
import MainScreen from './components/MainScreen';




export default function App() {
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    return (
        <View>
            {session && session.user ? <Account key={session.user.id} session={session} /> : <Auth />}
        </View>
    );
}
