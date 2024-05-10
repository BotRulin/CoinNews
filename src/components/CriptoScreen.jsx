import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Make sure to install this package
import Icon2 from "react-native-vector-icons/FontAwesome";
import { supabase } from '../lib/Supabase';


export default function CriptoScreen() {
    const route = useRoute();
    const session = route.params ? route.params.session : null;
    const { crypto } = route.params;
    const navigation = useNavigation();
    const [isFollowing, setIsFollowing] = useState(false); // Add this line
    const [cryptocurrencyPosts, setCryptocurrencyPosts] = useState([]); // Define cryptocurrencyPosts state
    const [loading, setLoading] = useState(false); // Define loading state

    useEffect(() => {
        checkIfFollowing();
        fetchCryptocurrencyPosts(crypto.id);
    }, []);

    const likePost = async (postId) => {
        const post = cryptocurrencyPosts.find((post) => post.id === postId);
        const newLikesCount = post.likes + 1;

        const { error } = await supabase
            .from('cryptocurrency_posts')
            .update({ likes: newLikesCount })
            .eq('id', postId);

        if (error) {
            console.log('Error liking post: ', error);
        } else {
            // Update the local state
            setCryptocurrencyPosts(cryptocurrencyPosts.map((post) =>
                post.id === postId ? { ...post, likes: newLikesCount, liked_by_user: true } : post
            ));
        }
    };

    const unlikePost = async (postId) => {
        const post = cryptocurrencyPosts.find((post) => post.id === postId);
        const newLikesCount = post.likes - 1;

        const { error } = await supabase
            .from('cryptocurrency_posts')
            .update({ likes: newLikesCount })
            .eq('id', postId);

        if (error) {
            console.log('Error unliking post: ', error);
        } else {
            // Update the local state
            setCryptocurrencyPosts(cryptocurrencyPosts.map((post) =>
                post.id === postId ? { ...post, likes: newLikesCount, liked_by_user: false } : post
            ));
        }
    };


    const checkIfFollowing = async () => {
        const { data, error } = await supabase
            .from('cryptocurrency_tracking')
            .select('cryptocurrency_id')
            .eq('user_id', session.user.id)
            .eq('cryptocurrency_id', crypto.id);

        if (error) {
            console.log('Error checking following status: ', error);
        } else if (data.length > 0) {
            setIsFollowing(true);
        }
    };

    const followCryptocurrency = async () => {
        const { error } = await supabase
            .from('cryptocurrency_tracking')
            .insert([
                { user_id: session.user.id, cryptocurrency_id: crypto.id }
            ]);

        if (error) {
            console.log('Error following cryptocurrency: ', error);
        } else {
            setIsFollowing(true);
        }
    };

    const unfollowCryptocurrency = async () => {
        const { error } = await supabase
            .from('cryptocurrency_tracking')
            .delete()
            .eq('user_id', session.user.id)
            .eq('cryptocurrency_id', crypto.id);

        if (error) {
            console.log('Error unfollowing cryptocurrency: ', error);
        } else {
            setIsFollowing(false);
        }
    };

    async function fetchCryptocurrencyPosts(cryptocurrencyId) {
        try {
            setLoading(true); // Set loading to true while fetching data

            const { data, error } = await supabase
                .from('cryptocurrency_posts')
                .select('*')
                .eq('cryptocurrency_id', cryptocurrencyId)
                .order('post_date', { ascending: false }); // Order by post_date in descending order

            if (error) throw error;

            if (data) {
                setCryptocurrencyPosts(data); // Update cryptocurrencyPosts
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Cryptocurrency Posts Fetch Error', error.message);
            }
        } finally {
            setLoading(false); // Set loading to false once the data fetch is complete or fails
        }
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Icon name="chevron-left" size={24} color="#fff" onPress={() => navigation.goBack()}/>
            </View>
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/icon.png')} style={styles.logo} />
            </View>
            <View style={styles.rightContainer}>
                <View style={styles.rankBackground}>
                    <Text style={styles.rank}>#1188</Text>
                </View>
                {isFollowing ? (
                    <TouchableOpacity style={styles.unfollowButton} onPress={unfollowCryptocurrency}>
                        <Text style={styles.unfollowButtonText}>Dejar de seguir</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.followButton} onPress={followCryptocurrency}>
                        <Text style={styles.followButtonText}>Seguir</Text>
                    </TouchableOpacity>
                )}
            </View>
            <View style={styles.cryptoContainer}>
                <View style={styles.cryptoTextContainer}>
                    <Text style={styles.title}>{crypto.symbol}</Text>
                    <Text style={styles.title2}>@{crypto.name}</Text>
                </View>
                <View style={styles.detailContainer}>
                    <Text style={styles.price}>PRECIO $6,964.851</Text>
                    <Text style={styles.marketCap}>MCAP $0.03209</Text>
                </View>
            </View>
            <View style={styles.container2}>
                <Icon name="web" size={24} color="#fff" />
                <Icon name="file-outline" size={24} color="#fff" style={styles.paddingLeft}/>
                <Icon name="github" size={24} color="#fff" style={styles.paddingLeft}/>
            </View>
            {cryptocurrencyPosts.map((post) => (
                <View style={styles.container3}>
                    <View key={post.id}>
                        <View style={styles.flexRow}>
                            <Image alt={"Logo"} style={styles.logoFollowing} source={require('../../assets/icon.png')}/>
                            <Text style={styles.Siguiendo}>{crypto.symbol}</Text>
                        </View>
                        <Text style={styles.PostText}>{post.content}</Text>
                        {post.image && (
                            <Image alt={"Post Image"} style={styles.PostImage} source={{uri: post.image}}/>
                        )}
                        <View style={styles.likeButtonContainer}>
                            <TouchableOpacity
                                style={styles.likeButton}
                                onPress={() => post.liked_by_user ? unlikePost(post.id) : likePost(post.id)}
                            >
                                <Icon2 name={post.liked_by_user ? "heart" : "heart-o"} size={14} color="#ffffff" />
                                <Text style={styles.likesCount}>{post.likes}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        padding: 20,
        paddingTop: 30,
    },
    container2: {
        flexDirection: 'row', // Coloca los iconos en una fila
        justifyContent: 'flex-start', // Alinea los iconos a la izquierda
    },
    PostImage: {
        height: 130, // Cambia el valor según el tamaño deseado
        width: '100%',
        alignSelf: 'left',
        borderRadius: 10,
        marginTop: 10,
    },
    container3: {
        backgroundColor: '#18181B',
        padding: 12,
        marginTop: 12,
        borderRadius: 10,
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    likeButton: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#D4D4D8',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 100
    },
    likeButtonContainer: {
        flexDirection: 'row',  // Asegura que los elementos se ordenen horizontalmente
        justifyContent: 'flex-end',  // Alinea los elementos al final del contenedor
        marginRight: 12,  // Añade un margen derecho si es necesario
    },
    PostText: {
        color: '#9EA2A7',
        fontSize: 14,
        fontWeight: '400',
        marginTop: 5,
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
    likesCount: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 12,
    },
    logoFollowing: {
        height: 27, // Cambia el valor según el tamaño deseado
        width: 27,
        alignSelf: 'left',
        borderRadius: 100,
    },
    Siguiendo: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '400',
        paddingRight: 5,
    },
    paddingLeft: {
        paddingLeft: 10,
    },
    rightContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    logoContainer: {
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 40, // Adjust the borderRadius to fit your logo shape
        borderWidth: 1,
        borderColor: "#26292B",
    },
    title: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    title2: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 5,
        fontWeight: "200",
    },
    rankBackground: {
        backgroundColor: '#42474E', // Cambia esto al color deseado
        padding: 6,
        borderRadius: 10,
        alignSelf: 'center',
        marginRight: 10,
    },
    rank: {
        color: '#fff', // White text color
        fontSize: 16, // Font size
        fontWeight: '400', // Bold font weight
        textAlign: 'center', // Center text horizontally
    },
    cryptoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    cryptoTextContainer: {
        alignItems: 'flex-start',
    },
    detailContainer: {
        alignItems: 'flex-end',
    },
    price: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 5,
    },
    marketCap: {
        color: '#fff',
        fontSize: 14,
    },
    followButton: {
        backgroundColor: '#F1F5F9',
        borderRadius: 100,
        paddingVertical: 6,
        paddingHorizontal: 20,
        borderWidth: 1,
        alignItems: 'center',
    },
    followButtonText: {
        color: '#000000',
        fontWeight: "600",
        fontSize: 14,
    },
});
