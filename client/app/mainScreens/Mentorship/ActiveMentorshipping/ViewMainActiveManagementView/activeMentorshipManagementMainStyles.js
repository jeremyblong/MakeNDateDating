import {StyleSheet, Dimensions} from 'react-native';
import {BaseColor} from '@config';


const { width, height } = Dimensions.get("window");


const styles = StyleSheet.create({
    contain: {
        padding: 20,
        borderRadius: 8,
        width: '100%',
    },
    packageTitleContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    contentPrice: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        minHeight: 75.25,
        height: 75.25
    },
    containItem: {
        padding: 10,
        alignItems: 'center',
        borderTopWidth: 1,
    },
    topImageText: {
        fontSize: 22.25,
        fontWeight: "400",
        textDecorationLine: "underline", 
        textAlign: "center",
        marginTop: 100
    },
    contentTopIcon: {
        alignItems: 'center',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        paddingBottom: 10,
        paddingTop: 10,
    },
    noResultsIllustration: {
        minWidth: "100%",
        width: "100%",
        height: height * 0.325,
        maxHeight: height * 0.325,
        marginTop: 75,
        borderRadius: 22.25
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    lineIcon: {
        width: 48,
        height: 2,
        borderRadius: 1,
        backgroundColor: '#B1ADAD',
        marginTop: 10,
        marginBottom: 10,
    },
    serviceContentIcon: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 20,
    },
    priceContentIcon: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    container: {
        flex: 1,
        margin: 20,
    }
});
export default styles;