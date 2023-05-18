import React, { Fragment } from "react";
import { View, Dimensions } from "react-native";
import { Text as NativeText, Card, Icon } from '@rneui/themed';
import styles from "./customCalloutHelperStyles.js";

const CalloutRenderCustomSelectNearbyDropoffWithServiceDelivery = (props) => {

    const { mainData, likes, dislikes, postedByName, postedByUsername
    } = props;

    const { mainCategory, subCategory, contactRequiredOrNot, description } = mainData;
    
    return (
        <Fragment>
            <Card containerStyle={styles.calloutInnerWrapperCardContainer} style={styles.calloutInnerStyle} wrapperStyle={styles.calloutInnerStyle}>
                <Card.Title style={styles.headerTitleMain}>{`${postedByName} a.k.a. ${postedByUsername}`}</Card.Title>
                <Card.Divider />
                <View style={{ flexDirection: "row", display: "flex" }}>
                    <View style={styles.column}>
                        <NativeText style={styles.likesDislikesLabel}>Like(s) / {"\n"}Dislike(s)</NativeText>
                        <NativeText style={styles.likesDislikesText}>{likes}/{dislikes}</NativeText>
                    </View>
                    <View style={styles.column}>
                        <NativeText style={styles.likesDislikesLabel}>Contact Required Prior?</NativeText>
                        <NativeText style={styles.baselineSubText}>{contactRequiredOrNot.name === "No, Contact is NOT required prior" ? "Not Required..." : "Required!"}</NativeText>
                    </View>
                </View>
                <View style={styles.hrThick} />
                <View style={{ flexDirection: "row", display: "flex" }}>
                    <View style={styles.column}>
                        <NativeText style={styles.likesDislikesLabel}>Main Category</NativeText>
                        <NativeText style={styles.baselineSubText}>{mainCategory.name}</NativeText>
                    </View>
                    <View style={styles.column}>
                        <NativeText style={styles.likesDislikesLabel}>Sub-Category</NativeText>
                        <NativeText style={styles.baselineSubText}>{subCategory.name}</NativeText>
                    </View>
                </View>
                <View style={styles.hrThick} />
                <View style={{ flexDirection: "row", display: "flex" }}>
                    <View style={styles.columnFullWidth}>
                        <NativeText style={styles.likesDislikesLabel}>Description</NativeText>
                        <NativeText style={styles.baselineSubText}>{description.slice(0, 100)}{typeof description !== "undefined" && description.length >= 100 ? "..." : ""}</NativeText>
                    </View>
                </View>
            </Card>
        </Fragment>
    );
}
export default CalloutRenderCustomSelectNearbyDropoffWithServiceDelivery;