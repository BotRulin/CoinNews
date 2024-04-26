import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/Supabase';
import {StyleSheet, View, Alert, Image, Text, TouchableOpacity} from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Session } from '@supabase/supabase-js';
import components from "../lib/Components";

export default function Account({ session }) {
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [website, setWebsite] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        if (session) getProfile();
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

    async function updateProfile({ username, website, avatar_url }) {
        try {
            setLoading(true);
            if (!session?.user) throw new Error('No user on the session!');

            const updates = {
                id: session?.user.id,
                username,
                website,
                avatar_url,
                updated_at: new Date(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);

            if (error) {
                throw error;
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
            <Image alt={"Logo"} style={styles.logo} source={require('../../assets/icon.png')}/>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Text style={styles.textMail}>{session?.user?.email}</Text>
            </View>
            {/*Parte perfil botones*/}
            <TouchableOpacity title={loading ? 'Loading ...' : 'Update'}
                              onPress={() => updateProfile({username, website, avatar_url: avatarUrl})}
                              disabled={loading}
                              style={styles.btnCambiarContrasena}>
                <Text style={styles.textCambiarContrasena}>Cambiar contraseña</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => supabase.auth.signOut()} style={styles.btnCerrarSesionUser}>
                <Text style={styles.textCerrarSesionUser}>Cerrar sesión</Text>
            </TouchableOpacity>
            <View style={[styles.verticallySpaced, styles.mt20, styles.flexRow]}>
                <Text style={styles.Siguiendo}>Siguiendo</Text>
                <Text style={styles.followingNumber}>5</Text>
            </View>
            <View style={[styles.verticallySpaced, styles.mt20, styles.flexRow]}>
                <Image alt={"Logo"} style={styles.logoFollowing} source={require('../../assets/icon.png')}/>
                <Text style={styles.Siguiendo}>$SCPT</Text>
                <TouchableOpacity style={styles.btnFollowing}>
                    <Text style={styles.textFollowing}>Dejar de</Text>
                </TouchableOpacity>
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
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 10,
        alignSelf: 'stretch',
        backgroundColor: '#00000',
        alignItems: 'flex-start',
    },
    mt20: {
        marginTop: 20,
    },
    textMail: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
    },
    logo: {
        marginTop: 15,
        height: 57, // Cambia el valor según el tamaño deseado
        width: 75,
        alignSelf: 'center',
    },
    logoFollowing: {
        height: 27, // Cambia el valor según el tamaño deseado
        width: 27,
        alignSelf: 'center',
        borderRadius: 100,
    },
    btnCambiarContrasena: {
        backgroundColor: '#F1F5F9', // Cambia el color de fondo del TouchableOpacity aquí
        padding: 10,
        borderRadius: 5, // Opcional: Agrega bordes redondeados al botón
        alignSelf: 'stretch',
        marginBottom: 10,
    },
    textCambiarContrasena: {
        color: '#020617',
        fontSize: 16,
        textAlign: 'center',
    },
    btnFollowing: {
        backgroundColor: '#27272A', // Cambia el color de fondo del TouchableOpacity aquí
        padding: 5,
        borderRadius: 100, // Opcional: Agrega bordes redondeados al botón
        alignSelf: 'stretch',
        borderWidth: 1, // Añade un borde al botón
        borderColor: '#F1F5F9', // Color del borde del botón
    },
    textCerrarSesionUser: {
        color: '#FDA4AF',
        fontSize: 16,
        textAlign: 'center',
    },
    textFollowing: {
        color: '#F1F5F9',
        fontSize: 16,
        textAlign: 'center',
    },
    Siguiendo: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '400',
        paddingRight: 5,
    },
    followingNumber: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '200',
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
