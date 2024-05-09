import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/Supabase';
import {StyleSheet, View, Alert, Text, Image, TouchableOpacity,  ScrollView} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from "react-native-vector-icons/FontAwesome";
import Account from "./Account";
import BottomNavigationBar from "./BottomMenu";


export default function Home() {
    const route = useRoute();
    const navigation = useNavigation();
    const [posts, setPosts] = useState([]);
    const session = route.params ? route.params.session : null;

    useEffect(() => {
        if (session) {
            try {
                fetchFollowedCryptosPosts();
            }catch (error) {
                Alert.alert("Failed to fetch posts", error.message);
            }
        }
    }, [session]);

    async function fetchFollowedCryptosPosts() {
        try {
            const { data, error } = await supabase
                .from('cryptocurrency_tracking')
                .select(`
            cryptocurrencies (
                symbol,
                cryptocurrency_posts (
                    id, content, image, likes, post_date,
                    cryptocurrency_post_likes (
                        user_id
                    )
                )
            )
        `)
                .eq('user_id', session?.user.id)
                .order('post_date', { foreignTable: 'cryptocurrencies.cryptocurrency_posts', ascending: false });

            if (error) {
                console.error('Error fetching posts:', error.message);
                throw error;
            }

            if (data && data.length > 0) {
                const postsData = data.map(track => {
                    return track.cryptocurrencies.cryptocurrency_posts.map(post => ({
                        id: post.id,  // Asegúrate de incluir el id del post aquí
                        symbol: track.cryptocurrencies.symbol,
                        content: post.content,
                        image: post.image,
                        likes: post.likes,
                        post_date: post.post_date,
                        liked_by_user: post.cryptocurrency_post_likes ? post.cryptocurrency_post_likes.some(like => like.user_id === session.user.id) : false

                    }));
                }).flat();

                setPosts(postsData);
            } else {
                console.log('No data or empty posts');
                setPosts([]);
            }
        } catch (error) {
            Alert.alert("Failed to fetch posts", error.message);
        }
    }

    const toggleLike = async (post) => {
        try {
            const user_id = session.user.id;
            const post_id = post.id;

            // Verificar si el usuario ya ha dado like al post
            const { count: likeCount, error: likeError } = await supabase
                .from('cryptocurrency_post_likes')
                .select('*', { count: 'exact' })
                .eq('user_id', user_id)
                .eq('post_id', post_id);

            if (likeError) throw likeError;

            if (likeCount > 0) {
                // Si ya existe un like, eliminar la relación y restar un like al contador del post
                const { error: deleteError } = await supabase
                    .from('cryptocurrency_post_likes')
                    .delete()
                    .eq('user_id', user_id)
                    .eq('post_id', post_id);

                if (deleteError) throw deleteError;

                // Obtener el número actual de likes
                const { data: postData, error: postError } = await supabase
                    .from('cryptocurrency_posts')
                    .select('likes')
                    .eq('id', post_id)
                    .single();

                if (postError) throw postError;

                // Decrementar el contador de likes en la tabla de posts
                const { error: updateError } = await supabase
                    .from('cryptocurrency_posts')
                    .update({ likes: postData.likes - 1 })
                    .eq('id', post_id);

                if (updateError) throw updateError;
            } else {
                // Si no hay like, insertar uno nuevo y sumar un like al contador del post
                const { error: insertError } = await supabase
                    .from('cryptocurrency_post_likes')
                    .insert([{ user_id, post_id }]);

                if (insertError) throw insertError;

                // Obtener el número actual de likes
                const { data: postData, error: postError } = await supabase
                    .from('cryptocurrency_posts')
                    .select('likes')
                    .eq('id', post_id)
                    .single();

                if (postError) throw postError;

                // Incrementar el contador de likes en la tabla de posts
                const { error: updateError } = await supabase
                    .from('cryptocurrency_posts')
                    .update({ likes: postData.likes + 1 })
                    .eq('id', post_id);

                if (updateError) throw updateError;
            }

            // Actualizar la lista de posts en el estado después de cambiar el like
            fetchFollowedCryptosPosts();
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    async function fetchLogoUrl(symbol) {
        try {
            const response = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=${symbol}`, {
                headers: {
                    'X-CMC_PRO_API_KEY': '0630c906-7925-4d8a-935d-c417e837fc39'
                }
            });

            return response.data.data[symbol].logo;
        } catch (error) {
            console.error('Error fetching logo URL:', error.message);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.container2}>
                <ScrollView style={styles.scrollView}>
                    {posts.sort((a, b) => new Date(b.post_date) - new Date(a.post_date)).map((post, index) => (
                        <View key={index} style={styles.container3}>
                            <View style={styles.flexRow}>
                                <Image alt={"Logo"} style={styles.logoFollowing} source={require('../../assets/icon.png')}/>
                                <Text style={styles.Siguiendo}>${post.symbol}</Text>
                            </View>
                            <Text style={styles.PostText}>{post.content}</Text>
                            <Image alt={"Post Image"} style={styles.PostImage} source={post.image ? { uri: post.image } : require('../../assets/icon.png')}/>
                            <View style={styles.likeButtonContainer}>
                                <TouchableOpacity
                                    style={styles.likeButton}
                                    onPress={() => toggleLike(post)} // Aquí se cambió 'post.post_id' por 'post'
                                >
                                    <Icon name={post.liked_by_user ? "heart" : "heart-o"} size={14} color="#ffffff" />
                                    <Text style={styles.likesCount}>{post.likes}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
            <View>
                <BottomNavigationBar navigation={navigation} session={session} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#000000',
        flex: 1,
    },
    container2: {
        height: '100%',
        backgroundColor: '#000000',

    },
    container3: {
        backgroundColor: '#18181B',
        padding: 12,
        margin: 12,
        borderRadius: 10,
    },
    scrollView: {
        flex: 1,  // Asegura que el ScrollView pueda expandirse completamente dentro de container2
        marginBottom: 58,  // Ajusta esto al tamaño de tu barra de navegación inferior
    },
    logoFollowing: {
        height: 27, // Cambia el valor según el tamaño deseado
        width: 27,
        alignSelf: 'left',
        borderRadius: 100,
    },
    PostImage: {
        height: 130, // Cambia el valor según el tamaño deseado
        width: '100%',
        alignSelf: 'left',
        borderRadius: 10,
        marginTop: 10,
    },
    Siguiendo: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '400',
        paddingRight: 5,
    },
    PostText: {
        color: '#9EA2A7',
        fontSize: 14,
        fontWeight: '400',
        marginTop: 5,
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
    likesCount: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 12,
    },
    likeButtonContainer: {
        flexDirection: 'row',  // Asegura que los elementos se ordenen horizontalmente
        justifyContent: 'flex-end',  // Alinea los elementos al final del contenedor
        marginRight: 12,  // Añade un margen derecho si es necesario
    },
});
