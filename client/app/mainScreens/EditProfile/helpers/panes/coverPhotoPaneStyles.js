import { StyleSheet, Dimensions } from "react-native";
import { Colors, Sizes, Fonts } from "../../../../constants/styles.js"; 

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    titleWrapper: {

    },
    inputWrapper: {

    },
    contentContainer: {
        flex: 1 
    },
    footer: {
        height: 82.25
    }
});

export default styles;