import {Image, Text, TextInput, TouchableOpacity, View} from "react-native";
import styles from "./Styles";
import {Input} from "react-native-elements";
import React from "react";

const components = {
    Logo: Logo
}

export default components;

function Logo(style) {
    return (
        <Image alt={"Logo"} style={style} source={require('../../assets/icon.png')}/>
    )
}
