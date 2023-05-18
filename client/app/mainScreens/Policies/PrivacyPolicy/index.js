import React, { Fragment } from "react";
import { Icon, Header } from "@components";
import { useTheme } from '@config';
import { useNavigation } from "@react-navigation/native";
import WebView from 'react-native-webview';
import styles from "./styles.js";
                

const PrivacyPolicyMain = () => {

    const {colors, theme} = useTheme();
    const navigation = useNavigation();
    return (
        <Fragment>
            <Header
                title={"Privacy Policy"}
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
                source={{ uri: "https://app.termly.io/document/privacy-policy/e5b9725d-b2d7-43ea-b698-7347225a5788" }}
                originWhitelist={['*']}
                containerStyle={styles.containerStyleViewview} 
            />
        </Fragment>
    );
}
export default PrivacyPolicyMain;