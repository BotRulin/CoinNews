import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/Supabase';
import {StyleSheet, View, Alert, Image, Text, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from "react-native-vector-icons/FontAwesome";
import Home from "./Home";

export default function Account({ session }) {
    const route = useRoute();
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [website, setWebsite] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [cryptocurrencies, setCryptocurrencies] = useState([]);
    const navigation = useNavigation();

    if (session == null){
        session = route.params?.session;
    }

    useEffect(() => {
        if (session) getProfile();
        getCryptocurrencies().then(setCryptocurrencies);
        console.log(cryptocurrencies)
    }, [session], [cryptocurrencies], []);

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

    async function sendPasswordResetEmail() {
        try {
            setLoading(true);
            if (!session?.user) throw new Error('No user on the session!');
            const { error } = await supabase.auth.resetPasswordForEmail(session.user.email);
            if (error) {
                throw error;
            }else {
                Alert.alert("Se ha enviado un correo electrónico para restablecer tu contraseña.");
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    async function getCryptocurrencies() {
        try {
            setLoading(true);
            if (!session?.user) throw new Error('No user on the session!');
            const { data, error } = await supabase
                .from('cryptocurrency_tracking')
                .select('cryptocurrencies(id, symbol)')
                .eq('user_id', session?.user.id);

            if (error) {
                throw error;
            }
            if (data) {
                return data.map(item => item.cryptocurrencies);
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    async function unfollowCryptocurrency(cryptocurrencyId) {
        try {
            setLoading(true);
            if (!session?.user) throw new Error('No user on the session!');
            const { error } = await supabase
                .from('cryptocurrency_tracking')
                .delete()
                .eq('user_id', session?.user.id)
                .eq('cryptocurrency_id', cryptocurrencyId);
            if (error) {
                throw error;
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
            getCryptocurrencies().then(setCryptocurrencies); // Vuelve a obtener las criptomonedas
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.container2}>
                <Image alt={"Logo"} style={styles.logo} source={require('../../assets/icon.png')}/>
                <View style={[styles.verticallySpaced, styles.mt20]}>
                    <Text style={styles.textMail}>{session?.user?.email}</Text>
                </View>
                {/*Parte perfil botones*/}
                <TouchableOpacity title={loading ? 'Loading ...' : 'Enviar correo'}
                                  onPress={sendPasswordResetEmail}
                                  disabled={loading}
                                  style={styles.btnCambiarContrasena}>
                    <Text style={styles.textCambiarContrasena}>Cambiar contraseña</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => supabase.auth.signOut()} style={styles.btnCerrarSesionUser}>
                    <Text style={styles.textCerrarSesionUser}>Cerrar sesión</Text>
                </TouchableOpacity>
                <View style={[styles.verticallySpaced, styles.mt20, styles.flexRow]}>
                    <Text style={styles.Siguiendo}>Siguiendo</Text>
                    <Text style={styles.followingNumber}>{cryptocurrencies.length}</Text>
                </View>
                <ScrollView style={styles.scrollView}>
                    {cryptocurrencies.map((item, index) => (
                        <View key={index} style={[styles.verticallySpaced, styles.mt20, styles.flexRow, styles.spaceBetween]}>
                            <View style={styles.flexRow}>
                                <Image alt={"Logo"} style={styles.logoFollowing} source={require('../../assets/icon.png')}/>
                                <Text style={styles.Siguiendo}>${item.symbol}</Text>
                            </View>
                            <TouchableOpacity style={styles.btnFollowing} onPress={() => unfollowCryptocurrency(item.id)}>
                                <Text style={styles.textFollowing}>Dejar de seguir</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
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
                <Icon name="home" size={20} color="#e2e8f0" onPress={ () => navigation.navigate('Home', { session: session })} />
                <Icon name="search" size={20} color="#e2e8f0" />
                <Icon name="user" size={20} color="#e2e8f0" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#000000',
    },
    container2: {
        height: '100%',
        padding: 12,
        backgroundColor: '#000000',
    },
    scrollView: {
        marginBottom: '20%',
    },
    spaceBetween: {
        justifyContent: 'space-between',
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
    btnCerrarSesionUser: {
        backgroundColor: '#27272A', // Cambia el color de fondo del TouchableOpacity aquí
        padding: 10,
        borderRadius: 5, // Opcional: Agrega bordes redondeados al botón
        alignSelf: 'stretch',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#FDA4AF',
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
        paddingLeft: 5,
        paddingRight: 5,
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
    }
});
