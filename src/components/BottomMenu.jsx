// Componente BottomNavigationBar.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";

export default function BottomNavigationBar({ navigation, session }) {
    return (
        <View style={styles.navBar}>
            <TouchableOpacity onPress={() => navigation.navigate('Home', { session })}>
                <Icon name="home" size={20} color="#e2e8f0" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Search', { session })}>
                <Icon name="search" size={20} color="#e2e8f0" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Main', { session })}>
                <Icon name="user" size={20} color="#e2e8f0" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 15,
        backgroundColor: '#000000',
        borderTopColor: '#e2e8f0',
        borderWidth: 1,
    }
});
