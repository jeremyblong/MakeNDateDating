import React, { Fragment, useState } from "react";
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { Platform, View } from "react-native";
import { IOS_APP_ID_ADVERTISING, ANDROID_APP_ID_ADVERTISING } from "@env";

const adUnitId = __DEV__ === true ? Platform.select({
    ios: "ca-app-pub-7717876124897798/6546039504",
    android: "ca-app-pub-3940256099942544/6300978111",
}) : Platform.select({
    ios: IOS_APP_ID_ADVERTISING,
    android: ANDROID_APP_ID_ADVERTISING,
});

const BannerAdsRenderSpacer = props => {
    const [ hidden, setHiddenState ] = useState(false);
    return (
        <Fragment>
            {hidden === false ? <Fragment>
                <View style={{ marginTop: 37.25 }} />
                <BannerAd
                    unitId={adUnitId}
                    onAdFailedToLoad={(error) => {
                        if (error) {
                            setHiddenState(true);
                        }
                    }}
                    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                    requestOptions={{
                        requestNonPersonalizedAdsOnly: false
                    }}
                />
            </Fragment> : null}
        </Fragment>
    );
}
export default BannerAdsRenderSpacer;