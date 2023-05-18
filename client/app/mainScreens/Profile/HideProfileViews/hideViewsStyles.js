import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        marginTop: 13.25,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    meta: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    author: {
        fontSize: 14,
        color: '#999',
        marginRight: 10,
    },
    date: {
        fontSize: 14,
        color: '#999',
    },
    imageCustomized: {
        width: '100%',
        minWidth: "100%",
        borderRadius: 12.25,
        borderWidth: 1,
        height: 375,
        marginBottom: 14.25,
    },
    image: {
        width: '100%',
        borderRadius: 12.25,
        borderWidth: 1,
        height: 325,
        marginBottom: 14.25,
    },
    content: {
        fontSize: 16,
        marginTop: 20,
    }
});

export default styles;