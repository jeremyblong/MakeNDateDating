import React, { Fragment } from "react";
import { View, Text, Image } from "react-native";
import styles from "./coverPhotoPaneStyles.js";
import { Button } from "@components";


const PaneUploadCoverPhotoHelper = ({ coverPhotoRef }) => {
    return (
        <Fragment>
            <View style={styles.container}>

                <View style={styles.contentContainer}>

                    <View style={styles.titleWrapper}>
                    
                    </View>
                    <View style={styles.inputWrapper}>
                    
                    </View>

                </View>
                <View style={styles.footer}>
                    <Button full outline onPress={() => coverPhotoRef.current.close()}>
                       Cancel/Close Pane
                    </Button>
                </View>
            </View>
        </Fragment>
    );
}
export default PaneUploadCoverPhotoHelper;