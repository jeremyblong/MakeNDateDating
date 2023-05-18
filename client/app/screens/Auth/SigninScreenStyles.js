import { Fonts, Colors, Sizes } from "../../constants/styles";
import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");


const styles = StyleSheet.create({
    loginWithFacebookButtonStyle: {
        flexDirection: 'row',
        backgroundColor: '#3B5998',
        paddingVertical: Sizes.fixPadding + 3.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Sizes.fixPadding,
        marginTop: Sizes.fixPadding * 3.5
    },
    customTextInputWrapper: {
        margin: 20,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    linearGradient: {
        width,
        height
    },  
    contentContainer: {
        justifyContent: 'center',
        paddingBottom: 75
    },
    registrationTxt: {
        ...Fonts.white16Medium, 
        alignSelf: 'center', 
        marginTop: -2.5, 
        marginBottom: -2.5, 
        color: "#fff",
    },
    searchIcon: {
        maxWidth: 27.5,
        maxHeight: 27.5,
        minWidth: 27.5,
        minHeight: 27.5,
        position: "absolute",
        right: 12.5,
        top: -12.5,
        zIndex: 99999,
        tintColor: "black",
        width: 27.5,
        height: 27.5
    },
    continueButtonStyleDisabled: {
        backgroundColor: Colors.whiteColor,
        paddingVertical: Sizes.fixPadding + 7.0,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding,
        marginTop: Sizes.fixPadding * 3.0
    },
    customTextInput: {
        ...Fonts.black17SemiBold, 
        backgroundColor: "white", 
        paddingTop: 12.5,
        paddingBottom: 12.5,
        borderRadius: 7.5,
        shadowColor: "grey",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        flex: 1
    },
    loginWithGoogleButtonStyle: {
        flexDirection: 'row',
        backgroundColor: Colors.whiteColor,
        paddingVertical: Sizes.fixPadding + 3.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Sizes.fixPadding,
        marginTop: Sizes.fixPadding * 2.5
    },
    continueButtonStyle: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding + 7.0,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding,
        marginTop: Sizes.fixPadding * 3.0
    },
    phoneNumberContainerStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        elevation: 1.0,
        height: 55.0,
    },
});

export default styles;