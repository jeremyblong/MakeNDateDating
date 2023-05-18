import React, { Fragment } from "react";
import { Icon, Header } from "@components";
import { useTheme } from '@config';
import { useNavigation } from "@react-navigation/native";
import WebView from 'react-native-webview';
import styles from "./styles.js";

const TermsOfUserDisplay = () => {

    const {colors, theme} = useTheme();
    const navigation = useNavigation();
    return (
        <Fragment>
            <Header
                title={"Terms of Use"}
                renderLeft={() => {
                    return (
                        <Icon
                            name="arrow-left"
                            size={20}
                            color={colors.primary}
                            enableRTL={true}
                        />
                    );
                }}
                onPressLeft={() => {
                    navigation.goBack();
                }}
            />
            <WebView
                source={{ uri: "https://app.termly.io/document/terms-and-conditions/3440396f-58a4-4c57-a54f-de4eeca681dd" }}
                originWhitelist={['*']}
                containerStyle={styles.containerStyleViewview} 
            />
        </Fragment>
    );
}
export default TermsOfUserDisplay;