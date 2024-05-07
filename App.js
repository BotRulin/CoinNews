/*import React from 'react';
import 'react-native-url-polyfill/auto'
import Main from './src/Main'
import {View} from "react-native";

export default function App() {
    return (
        <View>
            <Main />
        </View>
    );
}*/


import React from 'react'
import 'react-native-url-polyfill/auto'
import {NavigationContainer} from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { View } from "react-native";

{/* Screens */}
import Main from './src/Main'
import Search from "./src/components/Search";
import Home from "./src/components/Home";
import CriptoScreen from "./src/components/CriptoScreen";
import BottomMenu from "./src/components/BottomMenu";
import {supabase} from "./src/lib/Supabase"; // Asegúrate de importar BottomMenu

const Stack = createStackNavigator();

function MainScreen({ navigation }) {
    return (
        <View style={{ flex: 1 }}>
            <Main />
        </View>
    );
}

function HomeScreen({ navigation }) {
    const session = supabase.auth._useSession(); // Asume que useSession es un hook personalizado para obtener la sesión
    return <Home session={session} navigation={navigation} />;
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Main" screenOptions={{headerShown: false}}>
                <Stack.Screen name="Main" component={MainScreen} />
                <Stack.Screen name="Search" component={Search} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="CriptoScreen" component={CriptoScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

