import {StyleSheet} from "react-native";
import { useFonts } from 'expo-font';


const styles= StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#09090b',
        display: 'flex',
        flexDirection: 'column'
    },
    header: {

    },
    body: {

    },
    logo: {
        width: '50%',
        height: '50%',
        display: 'flex',
        resizeMode: 'contain',
        alignSelf: 'center',
    },
    strong: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        alignSelf: 'center',
        marginTop: '-20%',
        marginBottom: '15%',
    },
    textBox: {
        color: 'grey',
        paddingLeft: 5,
        fontSize: 20,
        borderStyle: 'solid',
        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#e72179',
        textAlign: 'left',
        marginLeft: '10%',
        marginRight: '10%',
        marginBottom: '5%',
        marginTop: '5%',
        backgroundColor: '#ffffff',
    },
    textButton: {
        backgroundColor: 'rgba(0,122,255,0)',
        color: '#e72179',
        borderRadius: 8,
        width: '80%',
        alignSelf: 'center',
        textAlign: 'center'
    },
    button: {
        backgroundColor: '#e72179',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        marginHorizontal: '10%',
        marginBottom: '5%',
        marginTop: '15%',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    }
})

export default styles;
