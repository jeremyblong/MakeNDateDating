import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        margin: 12.25
    },
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    titleAbout: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hr: {
        width: "100%",
        minWidth: "100%",
        borderBottomColor: "lightgrey",
        borderBottomWidth: 2,
        marginTop: 15.25,
        marginBottom: 10.25
    },
    helpfulText: {
        fontSize: 17.25,
        fontWeight: "bold",
        textAlign: "center",
        textDecorationLine: "underline"
    },  
    backgroundContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.475)",
        padding: 22.25,
        paddingLeft: 18.25,
        paddingRight: 18.25,
        borderWidth: 2,
        borderColor: "#fff"
    },
    video: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    placeholderImage: {
        width: "100%",
        marginTop: 20,
        minWidth: "100%",
        height: height * 0.425,
        minHeight: height * 0.425
    },
    noneAvailableText: {
        fontSize: 22.25,
        textAlign: "center",
        marginVertical: 12.25
    },
    centeredMargin: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        margin: 10
    },
    fullwidthTextContainerLarger: {
        minHeight: 375, 
        marginBottom: 50,
        borderRadius: 17.25,
        width: "100%",
        minWidth: "100%",
        backgroundColor: "#D81159"
    }, 
    mediumHR: {
        borderBottomColor: "#fff",
        borderBottomWidth: 2,
        marginTop: 12.25,
        marginBottom: 12.25,
        width: "100%"
    },
    innerTextCustomLarger: {
        color: "#fff",
        marginRight: 27.25,
        textDecorationLine: "underline",
        marginLeft: 27.25,
        marginTop: 12.25,
        fontSize: 24.25,
        textAlign: "left",
        fontWeight: "bold"
    }, 
    innerTextCustom: {
        color: "#fff",
        marginRight: 27.25,
        marginLeft: 27.25,
        fontSize: 24.25,
        textAlign: "left"
    },  
    fullwidthTextContainerBlue: {
        minHeight: 65, 
        marginBottom: 5,
        borderRadius: 20.25,
        paddingBottom: 10,
        paddingTop: 10,
        width: "100%",
        minWidth: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: "center"
    },  
    fullwidthTextContainer: {
        minHeight: 100, 
        marginBottom: 20,
        borderRadius: 17.25,
        paddingBottom: 10,
        paddingTop: 10,
        width: "100%",
        minWidth: "100%",
        backgroundColor: "#D81159",
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: "center"
    },  
    thumbnail: {
        width: '35%',
        aspectRatio: 16 / 9,
        borderRadius: 5,
    },
    details: {
        padding: 10,
        width: '65%',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    channel: {
        color: '#999',
        fontSize: 14,
        marginTop: 5,
    },
    viewCount: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    
    views: {
        color: '#999',
        fontSize: 14,
    },
    duration: {
        color: '#999',
        fontSize: 14,
        marginLeft: 10,
    }
});

export default styles;