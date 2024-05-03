import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/Supabase';
import { StyleSheet, View, Alert, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from "react-native-vector-icons/FontAwesome";
import Account from "./Account";


export default function Home() {
    const route = useRoute();
    const { session } = route.params; // Obtener la sesión de los parámetros de la ruta
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [website, setWebsite] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        if (session) {
            getProfile();
        }
    }, [session]);

    async function getProfile() {
        try {
            setLoading(true);
            if (!session?.user) throw new Error('No user on the session!');

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`username, website, avatar_url`)
                .eq('id', session?.user.id)
                .single();
            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setUsername(data.username);
                setWebsite(data.website);
                setAvatarUrl(data.avatar_url);
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'absolute', // Posiciona el menú en la parte inferior
                bottom: 0.5, // Asegura que el menú esté al final de la pantalla
                width: '100%', // Asegura que el menú ocupe todo el ancho de la pantalla
                paddingBottom: '10%',
                paddingTop: '3%',
                paddingHorizontal: '10%',
                backgroundColor: '#000000',
                borderStyle: 'solid',
                borderTopColor: '#e2e8f0',
                borderWidth: 1,
            }}>
                <Icon name="home" size={20} color="#e2e8f0" />
                <Icon name="search" size={20} color="#e2e8f0" />
                <Icon name="user" size={20} color="#e2e8f0" onPress={() => navigation.navigate('Account', { session: session })} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        padding: 12,
        backgroundColor: '#000000',
    },
    textMail: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
    },
});
