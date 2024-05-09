import React, { useState, useEffect } from 'react';
import {StyleSheet, View, TextInput, FlatList, Text, TouchableOpacity, Image, Alert} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomNavigationBar from "./BottomMenu";
import { supabase } from "../lib/Supabase";
import { useFocusEffect } from '@react-navigation/native';

export default function Search() {
    const route = useRoute();
    const navigation = useNavigation();
    const session = route.params?.session;

    const [loading, setLoading] = useState(false); // Define loading state
    const [search, setSearch] = useState(''); // Define search state
    const [cryptocurrencies, setCryptocurrencies] = useState([]); // Define cryptocurrencies state
    const [followedCryptocurrencies, setFollowedCryptocurrencies] = useState([]); // Define followedCryptocurrencies state

    useEffect(() => {
        if (session) {
            fetchCryptocurrencies();
            fetchFollowedCryptocurrencies(); // Fetch followed cryptocurrencies when the component mounts
        }
    }, [session]);

    useFocusEffect(
        React.useCallback(() => {
            fetchCryptocurrencies();
            fetchFollowedCryptocurrencies(); // Fetch followed cryptocurrencies when the component mounts
        }, [])
    );

    async function fetchCryptocurrencies() {
        try {
            setLoading(true); // Set loading to true while fetching data

            const { data, error } = await supabase
                .from('cryptocurrencies')
                .select('*');


            if (error) throw error;

            if (data) {
                // Mapea los datos para incluir la imagen de la criptomoneda
                const cryptosWithImages = [];
                for (const crypto of data) {
                    const response = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=${crypto.symbol}`, {
                        headers: {
                            'X-CMC_PRO_API_KEY': '0630c906-7925-4d8a-935d-c417e837fc39'
                        }
                    });
                    const json = await response.json();
                    const coinData = json.data && json.data[crypto.symbol] ? json.data[crypto.symbol] : {};
                    if (coinData.logo) {
                        cryptosWithImages.push({
                            ...crypto,
                            imageUrl: coinData.logo
                        });
                    } else {
                        cryptosWithImages.push(crypto);
                    }
                }
                setCryptocurrencies(cryptosWithImages); // Update cryptocurrencies
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Cryptocurrencies Fetch Error', error.message);
            }
        } finally {
            setLoading(false); // Set loading to false once the data fetch is complete or fails
        }
    }



    async function fetchFollowedCryptocurrencies() {
        try {
            setLoading(true); // Set loading to true while fetching data

            const { data, error } = await supabase
                .from('cryptocurrency_tracking')
                .select('cryptocurrency_id')
                .eq('user_id', session.user.id);

            if (error) throw error;

            if (data) {
                setFollowedCryptocurrencies(data.map(item => item.cryptocurrency_id)); // Update followedCryptocurrencies
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Followed Cryptocurrencies Fetch Error', error.message);
            }
        } finally {
            setLoading(false); // Set loading to false once the data fetch is complete or fails
        }
    }

    const filteredCryptocurrencies = cryptocurrencies.filter(crypto => crypto.name.toLowerCase().includes(search.toLowerCase()) || crypto.symbol.toLowerCase().includes(search.toLowerCase()));

    async function followCryptocurrency(cryptocurrencyId) {
        try {
            const { error } = await supabase
                .from('cryptocurrency_tracking')
                .insert([
                    { user_id: session.user.id, cryptocurrency_id: cryptocurrencyId }
                ]);

            if (error) throw error;

            setFollowedCryptocurrencies([...followedCryptocurrencies, cryptocurrencyId]); // Update followedCryptocurrencies
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Follow Error', error.message);
            }
        }
    }

    async function unfollowCryptocurrency(cryptocurrencyId) {
        try {
            const { error } = await supabase
                .from('cryptocurrency_tracking')
                .delete()
                .eq('user_id', session.user.id)
                .eq('cryptocurrency_id', cryptocurrencyId);

            if (error) throw error;

            setFollowedCryptocurrencies(followedCryptocurrencies.filter(id => id !== cryptocurrencyId)); // Update followedCryptocurrencies
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Unfollow Error', error.message);
            }
        }
    }

    return (
        <View style={styles.container}>
            {loading ? (
                <Text>Cargando...</Text>
            ) : (
                <>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar"
                        placeholderTextColor="#ccc"
                        onChangeText={text => setSearch(text)} // Update search state when text changes
                    />
                    {/* Render filtered cryptocurrencies */}
                    {filteredCryptocurrencies.map(crypto => (
                        <TouchableOpacity onPress={() => navigation.navigate('CriptoScreen', { crypto, session })}>
                            <View style={styles.item} key={crypto.id}>
                                {crypto.imageUrl ? (
                                    <Image source={{ uri: crypto.imageUrl }} style={{ width: 30, height: 30, resizeMode: 'cover', borderRadius: 15 }} />
                                ) : (
                                    <Image alt={"Logo"} style={{ width: 30, height: 30, resizeMode: 'cover', borderRadius: 15}} source={require('../../assets/icon.png')} />
                                )}

                                <Text style={styles.username}>{crypto.name}</Text>
                                {followedCryptocurrencies.includes(crypto.id) ? (
                                    <TouchableOpacity style={styles.unfollowButton} onPress={() => unfollowCryptocurrency(crypto.id)}>
                                        <Text style={styles.unfollowButtonText}>Dejar de seguir</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity style={styles.followButton} onPress={() => followCryptocurrency(crypto.id)}>
                                        <Text style={styles.followButtonText}>Seguir</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                    <BottomNavigationBar navigation={navigation} session={session} />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: 30,
    },
    searchInput: {
        fontSize: 16,
        margin: 12,
        padding: 10,
        backgroundColor: '#F1F5F9',
        borderRadius: 100,
        color: '#000000',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginLeft: 12,
        marginRight: 12,
    },
    username: {
        flex: 1,
        marginLeft: 20,
        color: '#fff',
        fontSize: 16,
    },
    followButton: {
        backgroundColor: '#F1F5F9',
        borderRadius: 100,
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderWidth: 1, // Añade un borde al botón
    },
    unfollowButton: {
        paddingVertical: 6,
        paddingHorizontal: 20,
        backgroundColor: '#27272A', // Cambia el color de fondo del TouchableOpacity aquí
        borderRadius: 100, // Opcional: Agrega bordes redondeados al botón
        borderWidth: 1, // Añade un borde al botón
        borderColor: '#F1F5F9', // Color del borde del botón
    },
    unfollowButtonText: {
        color: '#F1F5F9',
        fontWeight: "600",
        fontSize: 14,
    },
    followButtonText: {
        color: '#000000',
        fontWeight: "600",
        fontSize: 14,
    },
});
