import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    centered: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center"
    },
    containerStyleViewview: {
        width: "95%", 
        height: "100%",
        margin: 12.25
    }
});

export default styles;