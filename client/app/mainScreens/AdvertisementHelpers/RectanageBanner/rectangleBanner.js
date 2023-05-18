import React, { Fragment, useState } from "react";
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { Platform, View } from "react-native";
import { IOS_APP_ID_ADVERTISING, ANDROID_APP_ID_ADVERTISING } from "@env";
import styles from "./rectangeBannerStyles.js";
import { BaseColor, Images, useTheme } from '@config';

const adUnitId = __DEV__ === true ? Platform.select({
    ios: "ca-app-pub-7717876124897798/6546039504",
    android: "ca-app-pub-3940256099942544/6300978111",
}) : Platform.select({
    ios: IOS_APP_ID_ADVERTISING,
    android: ANDROID_APP_ID_ADVERTISING,
});

console.log("BannerAdSize", BannerAdSize);

const RectangeCenteredBannerRender = props => {
    const {colors} = useTheme();
    const [ hidden, setHiddenState ] = useState(false);
    return (
        <Fragment>
            <View style={styles.centered}>
                {hidden === false ? <BannerAd
                    unitId={adUnitId}
                    onAdFailedToLoad={(error) => {
                        if (error) {
                            setHiddenState(true);
                        }
                    }}
                    size={BannerAdSize.MEDIUM_RECTANGLE}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: false
                    }}
                /> : null}
            </View>
        </Fragment>
    );
}
export default RectangeCenteredBannerRender;