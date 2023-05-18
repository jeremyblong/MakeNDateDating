import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center'
    },
    header: {
        marginTop:30,
        padding:10,
        backgroundColor:'#fff',
        justifyContent: 'center',
    },
    name: {
        fontSize:20,
        fontWeight:'bold',
        marginLeft:20,
        marginBottom:3,
    },
    subText: {
        fontSize:14,
        marginLeft:20,
        color:'#808080'
    },
    opponentContainer: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    opponentVideo: {
        flex: 1,
    },
    currentContainer: {
        position: 'absolute',
        top: 82.25,
        left: 20,
        backgroundColor: "#000",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    },
    currentUser: {
        width: 100,
        height: 150,
    },
    controlsContainer: {
        height:80,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    controlButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 10,
        marginHorizontal: 10,
        borderRadius: 5,

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    },
    endCallButton:{
        backgroundColor: '#FF4500'
    },
    startCallButton:{
        backgroundColor: 'green'
    }
});

export default styles;