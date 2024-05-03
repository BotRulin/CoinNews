import React from "react";
import { View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Home from "./Home";
import Account from "./Account";


export default function BottomMenu({ navigation }) {
    return (
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
            <Icon name="home" size={20} color="#e2e8f0" onPress={() => {navigation.navigate(Home)}} />
            <Icon name="search" size={20} color="#e2e8f0" onPress={() => {navigation.navigate(Account)}} />
            <Icon name="user" size={20} color="#e2e8f0" onPress={() => {navigation.navigate(Account)}} />
        </View>
    );
}

