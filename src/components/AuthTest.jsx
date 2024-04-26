import React, { useState } from 'react'
import {Alert, StyleSheet, View, AppState, Text, TouchableOpacity, Image, TextInput} from 'react-native'
import { supabase } from '../lib/Supabase'
import Icon from 'react-native-vector-icons/FontAwesome';


// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

export default function Auth() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [hidePassword, setHidePassword] = useState(true)

    async function signInWithEmail() {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
        setLoading(false)
    }

    async function signUpWithEmail() {
        setLoading(true)
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
        if (!session) Alert.alert('Please check your inbox for email verification!')
        setLoading(false)
    }

    const styles = StyleSheet.create({
        /* Container Styles */
        container: {
            width: '100%',
            height: '100%',
            backgroundColor: '#09090b',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },

        /* Image Styles */
        logo: {
            width: '30%',
            height: '10%',
            marginTop: '-20%',
            marginBottom: '5%',
        },

        /* Text Styles */
        title: {
            color: 'white',
            fontSize: 32,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            marginBottom: 10,
        },
        subtitle: {
            color: 'lightgrey',
            fontSize: 16,
            textTransform: 'lowercase',
            marginBottom: 30,
        },

        /* Input Styles */
        inputContainer: {
            flexDirection: 'row',
            width: '80%',
            marginBottom: 15,
            backgroundColor: 'white',
            borderRadius: 50,
            borderColor: 'white',
            borderWidth: 1,
            padding: 10,
        },
        icon: {
            marginRight: 10,
        },

        /* Button Styles */
        buttonContainer: {
            width: '40%',
            marginTop: 15,
            backgroundColor: '#27272a',
            borderWidth: 2,
            borderColor: '#52525b',
            borderRadius: 20,
            padding: 10,
        },
        buttonText: {
            fontSize: 20,
            color: 'white',
            textAlign: 'center',
        },
    })

    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image alt={"Logo"} style={styles.logo} source={require('../../assets/icon.png')}/>
            {/* Titles */}
            <Text style={styles.title}>INICIA SESIÓN</Text>
            <Text style={styles.subtitle}>para poder continuar</Text>
            {/* Inputs */}
            <View style={styles.inputContainer}>
                <Icon name="envelope" size={20} color="black" style={styles.icon} />
                <TextInput
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="Email"
                    autoCapitalize={'none'}
                />
            </View>
            <View style={{...styles.inputContainer, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="lock" size={20} color="black" style={{...styles.icon, marginLeft: 4, marginRight: 12}} />
                    <TextInput
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={hidePassword}
                        placeholder="Password"
                        autoCapitalize={'none'}
                    />
                </View>
                <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
                    <Icon name={hidePassword ? 'eye-slash' : 'eye'} size={20} color="black" />
                </TouchableOpacity>
            </View>

            {/* Buttons */}
            <TouchableOpacity style={{marginTop:'2%', marginBottom:'3%'}} disabled={loading} onPress={() => signUpWithEmail()}>
                <Text style={{color: '#60a5fa'}}>No tengo cuenta de CoinNews</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonContainer} disabled={loading} onPress={() => signInWithEmail()}>
                <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
        </View>
    )
}


