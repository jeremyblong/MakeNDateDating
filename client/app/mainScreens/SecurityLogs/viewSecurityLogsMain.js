import React, { Fragment, useState, useEffect } from "react";
import { View, Text, FlatList, Dimensions } from "react-native";
import { Card } from "@rneui/themed";
import styles from "./viewSecurityLogsMainStyles.js";
import Svg, { Path } from 'react-native-svg';
import { connect } from "react-redux";
import { Header, Icon } from "@components";
import moment from "moment";
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
    Fade
} from "rn-placeholder";
import { BaseColor, useTheme } from '@config';
import _ from "lodash";
import { useNavigation } from "@react-navigation/native"; // 

const { width, height } = Dimensions.get("window");

const SecurityLogsListRenderHelper = ({ authData }) => {

    const {colors} = useTheme(); 

    const navigation = useNavigation();

    const [ newlyFormmattedArrData, setNewlyFormattedState ] = useState([]);
    // render header-related data/logic...
    const renderHeaderRelated = () => {
        return (
            <Fragment>
                <Header
                    title={"Security Log(s)"}
                    subTitle="Log's from authentications"
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
                <View style={styles.listTopContainer}>
                    <View style={styles.centeredTopPortion}>
                        <View style={[styles.middleChunkTextWrapper, { borderColor: "#000" }]}>
                            <Text style={styles.middleText}>These are your recent authentication logs, containing details on authentication time, device used, and other relevant information.</Text>
                        </View>
                    </View>
                    <Svg
                        height={275}
                        width={width}
                        viewBox="0 0 1440 320"
                        style={{ left: 0, right: 0, top: 0 }}
                        preserveAspectRatio="none"
                    >
                        <Path
                            fill={colors.accent}
                            d={"M0,32L6.9,53.3C13.7,75,27,117,41,138.7C54.9,160,69,160,82,144C96,128,110,96,123,122.7C137.1,149,151,235,165,277.3C178.3,320,192,320,206,282.7C219.4,245,233,171,247,165.3C260.6,160,274,224,288,250.7C301.7,277,315,267,329,229.3C342.9,192,357,128,370,96C384,64,398,64,411,69.3C425.1,75,439,85,453,96C466.3,107,480,117,494,122.7C507.4,128,521,128,535,117.3C548.6,107,562,85,576,106.7C589.7,128,603,192,617,192C630.9,192,645,128,658,122.7C672,117,686,171,699,192C713.1,213,727,203,741,208C754.3,213,768,235,782,218.7C795.4,203,809,149,823,133.3C836.6,117,850,139,864,133.3C877.7,128,891,96,905,85.3C918.9,75,933,85,946,106.7C960,128,974,160,987,149.3C1001.1,139,1015,85,1029,58.7C1042.3,32,1056,32,1070,64C1083.4,96,1097,160,1111,181.3C1124.6,203,1138,181,1152,176C1165.7,171,1179,181,1193,186.7C1206.9,192,1221,192,1234,170.7C1248,149,1262,107,1275,117.3C1289.1,128,1303,192,1317,202.7C1330.3,213,1344,171,1358,149.3C1371.4,128,1385,128,1399,149.3C1412.6,171,1426,213,1433,234.7L1440,256L1440,0L1433.1,0C1426.3,0,1413,0,1399,0C1385.1,0,1371,0,1358,0C1344,0,1330,0,1317,0C1302.9,0,1289,0,1275,0C1261.7,0,1248,0,1234,0C1220.6,0,1207,0,1193,0C1179.4,0,1166,0,1152,0C1138.3,0,1125,0,1111,0C1097.1,0,1083,0,1070,0C1056,0,1042,0,1029,0C1014.9,0,1001,0,987,0C973.7,0,960,0,946,0C932.6,0,919,0,905,0C891.4,0,878,0,864,0C850.3,0,837,0,823,0C809.1,0,795,0,782,0C768,0,754,0,741,0C726.9,0,713,0,699,0C685.7,0,672,0,658,0C644.6,0,631,0,617,0C603.4,0,590,0,576,0C562.3,0,549,0,535,0C521.1,0,507,0,494,0C480,0,466,0,453,0C438.9,0,425,0,411,0C397.7,0,384,0,370,0C356.6,0,343,0,329,0C315.4,0,302,0,288,0C274.3,0,261,0,247,0C233.1,0,219,0,206,0C192,0,178,0,165,0C150.9,0,137,0,123,0C109.7,0,96,0,82,0C68.6,0,55,0,41,0C27.4,0,14,0,7,0L0,0Z"}
                        />
                    </Svg>
                </View>
            </Fragment>
        );
    }
    // return item iteration item..
    const renderItem = ({ item, index }) => {

        const { brand, buildNumber, bundleID, deviceID, deviceType, deviceModel, systemVersion, systemName, tabletOrNot, deviceUniqueId, manufacturer, carrier, deviceName, ipAddress, macAddress, userAgent, dateOfOccurance, dateOfOccuranceString } = item;
        return (
            <Fragment key={index}>
                <Card containerStyle={{ marginTop: 15 }}>
                    <Card.Title style={styles.toppedText}>Authenticated Device Security Details</Card.Title>
                    <Card.Divider />
                    <View style={styles.rowItem}>
                        <View style={styles.halfColumnOnly}>
                            <View style={styles.columned}>
                                <Text style={styles.labelText}>Device Name:</Text>
                                <Text style={[styles.bulletItem, { color: colors.accent }]}>{deviceName}</Text>
                            </View>
                        </View>
                        <View style={styles.halfColumnOnly}>
                            <View style={styles.columned}>
                                <Text style={styles.labelText}>IP Address:</Text>
                                <Text style={[styles.bulletItem, { color: colors.accent }]}>{ipAddress}</Text>
                            </View>
                        </View> 
                    </View>
                    <View style={styles.rowItem}>
                        <View style={styles.halfColumnOnly}>
                            <View style={styles.columned}>
                                <Text style={styles.labelText}>Device Model:</Text>
                                <Text style={[styles.bulletItem, { color: colors.accent }]}>{deviceModel}</Text>
                            </View>
                        </View>
                        <View style={styles.halfColumnOnly}>
                            <View style={styles.columned}>
                                <Text style={styles.labelText}>Device Unique-ID:</Text>
                                <Text style={[styles.bulletItem, { color: colors.accent }]}>{deviceUniqueId}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.rowItem}>
                        <View style={styles.halfColumnOnly}>
                            <View style={styles.columned}>
                                <Text style={styles.labelText}>Device Type:</Text>
                                <Text style={[styles.bulletItem, { color: colors.accent }]}>{deviceType}</Text>
                            </View>
                        </View>
                        <View style={styles.halfColumnOnly}>
                            <View style={styles.columned}>
                                <Text style={styles.labelText}>Brand:</Text>
                                <Text style={[styles.bulletItem, { color: colors.accent }]}>{brand}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.rowItem}>
                        <View style={styles.halfColumnOnly}>
                            <View style={styles.columned}>
                                <Text style={styles.labelText}>System Name:</Text>
                                <Text style={[styles.bulletItem, { color: colors.accent }]}>{systemName}</Text>
                            </View>
                        </View>
                        <View style={styles.halfColumnOnly}>
                            <View style={styles.columned}>
                                <Text style={styles.labelText}>System Version:</Text>
                                <Text style={[styles.bulletItem, { color: colors.accent }]}>{systemVersion}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.rowItem}>
                        <View style={styles.halfColumnOnly}>
                            <View style={styles.columned}>
                                <Text style={styles.labelText}>Tablet:</Text>
                                <Text style={[styles.bulletItem, { color: colors.accent }]}>{tabletOrNot === true ? "Not A Tablet..." : "Device IS A Tablet!"}</Text>
                            </View>
                        </View>
                        <View style={styles.halfColumnOnly}>
                            <View style={styles.columned}>
                                <Text style={styles.labelText}>Device ID:</Text>
                                <Text style={[styles.bulletItem, { color: colors.accent }]}>{deviceID}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.rowItem}>
                        <View style={styles.halfColumnOnly}>
                            <View style={styles.columned}>
                                <Text style={styles.labelText}>Carrier:</Text>
                                <Text style={[styles.bulletItem, { color: colors.accent }]}>{typeof carrier !== "undefined" && carrier.length > 0 ? carrier : "Carrier Couldn't Be Detected..."}</Text>
                            </View>
                        </View>
                        <View style={styles.halfColumnOnly}>
                            <View style={styles.columned}>
                                <Text style={styles.labelText}>Manufacturer:</Text>
                                <Text style={[styles.bulletItem, { color: colors.accent }]}>{manufacturer}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.rowItem}>
                        <View style={styles.fullColumnOnly}>
                            <View style={styles.columnedBottom}>
                                <Text style={styles.labelTextFarBottom}>User Agent:</Text>
                                <Text style={[styles.bulletItem, { color: colors.accent }]}>{userAgent}</Text>
                            </View>
                        </View>
                    </View>
                    <Card.Divider />
                    <Text style={styles.bottomedText}>Logged/Occurred <Text style={[styles.underlinedBoldText, { color: BaseColor.greenColor }]}>{moment(dateOfOccurance).fromNow()}</Text></Text>
                </Card>
                <View style={[styles.renderedItemHR, { borderBottomColor: colors.primary }]} />
            </Fragment>
        );
    }
    const keyExtractor = (item, index) => index.toString();;

    useEffect(() => {
        const { securityAuthenticationLogs } = authData;
        
        if (typeof securityAuthenticationLogs !== "undefined" && securityAuthenticationLogs.length > 0) {
            const sortedByDate = securityAuthenticationLogs.sort((a, b) => {
                return new Date(b.dateOfOccurance) - new Date(a.dateOfOccurance);
            });
            setNewlyFormattedState(sortedByDate);
        } else {
            setNewlyFormattedState(securityAuthenticationLogs);
        }
    }, [])

    const renderEmptyListContent = () => {
        return (
            <View style={styles.highestTiered}>
                <Placeholder
                    Animation={Fade}
                    Left={PlaceholderMedia}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.25} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={PlaceholderMedia}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.25} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={PlaceholderMedia}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.25} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={PlaceholderMedia}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.25} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={PlaceholderMedia}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.25} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={PlaceholderMedia}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.25} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={PlaceholderMedia}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.25} />
                    <PlaceholderLine width={30} />
                </Placeholder>
                <Placeholder
                    Animation={Fade}
                    Left={PlaceholderMedia}
                >
                    <PlaceholderLine width={80} />
                    <PlaceholderLine width={width * 0.25} />
                    <PlaceholderLine width={30} />
                </Placeholder>
            </View>
        );
    }
    const renderFooterHelper = () => {
        return <View style={{ paddingBottom: 37.5 }} />;
    }
    // return MAIN data/jsx....
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                showsVerticalScrollIndicator={false}
                ListHeaderComponentStyle={styles.listheaderStyles}
                ListHeaderComponent={() => renderHeaderRelated()}
                keyExtractor={keyExtractor}
                ListEmptyComponent={renderEmptyListContent}
                data={newlyFormmattedArrData}
                renderItem={renderItem}
                ListFooterComponent={renderFooterHelper}
            />
        </View>
    );
};
const mapStateToProps = (state) => {
    return {
        authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
    }
}
export default connect(mapStateToProps, { })(SecurityLogsListRenderHelper);