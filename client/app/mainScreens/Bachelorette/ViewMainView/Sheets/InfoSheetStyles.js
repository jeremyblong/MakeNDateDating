import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    card: {
        shadowColor: '#B0C4DE',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
        margin: 10,
        borderRadius: 10,
        borderWidth: 1
    },
    membersText: {
        textAlign: "center"
    },
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    bacheloretteImage: {
        width: 125,
        height: 125,
        maxHeight: 125,
        marginTop: 12.25,
        borderRadius: 25,
        borderWidth: 2.25,
        maxWidth: 125
    },
    cardContent: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
    },
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 14.25,
        borderWidth: 0.5,
        margin: 10,
    },
    productName: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    productPrice: {
        fontSize: 16
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    buttonMain: {
        padding: 10,
        borderRadius: 5,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        minWidth: "40%"
    },
    button: {
        backgroundColor: '#eee',
        padding: 10,
        borderRadius: 5,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        minWidth: "40%"
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    avatar: {
        width: 75,
        height: 75,
        borderWidth: 1,
        borderRadius: 25,
    },
    info: {
        marginLeft: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    hr: {
        width: "100%",
        minWidth: "100%",
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2,
        marginTop: 10,
        marginBottom: 10
    },
    username: {
        color: '#999',
        fontSize: 18,
        marginBottom: 13.25
    },
    stats: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    stat: {
        flex: 1,
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 14,
    },
    statValue: {
        fontSize: 18,
    },
    bio: {
        padding: 20,
        fontSize: 16
    },
    bioGreen: {
        padding: 20,
        fontSize: 16,
        color: "green"
    }
});

export default styles;