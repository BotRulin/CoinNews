import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/Supabase';
import { View } from 'react-native';
import Home from './Home';
import Search from './Search';
import Account from './Account';
import BottomNavigationBar from './BottomMenu';

export default function MainScreen() {
    const [session, setSession] = useState(null);
    const [currentScreen, setCurrentScreen] = useState('Home');

    useEffect(() => {
        setSession(supabase.auth.session());

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    let ScreenComponent;

    switch (currentScreen) {
        case 'Home':
            ScreenComponent = Home;
            break;
        case 'Search':
            ScreenComponent = Search;
            break;
        case 'Account':
            ScreenComponent = Account;
            break;
        // Añade aquí más casos si tienes más pantallas
        default:
            ScreenComponent = Home;
    }

    return (
        <View style={{ flex: 1 }}>
            <ScreenComponent session={session} />
            <BottomNavigationBar
                currentScreen={currentScreen}
                onNavigate={setCurrentScreen}
                session={session}
            />
        </View>
    );
}
