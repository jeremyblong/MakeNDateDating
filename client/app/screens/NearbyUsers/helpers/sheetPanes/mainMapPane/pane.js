import React, { Fragment, useState, useEffect } from "react";
import { View, Text, Image, Dimensions } from "react-native"; 
import { ListItem, Avatar } from '@rneui/themed';
import styles from "./paneStyles.js";
import moment from "moment";
import uuid from "react-native-uuid";

const { width, height } = Dimensions.get("window");

const PaneSheetSelectTransportType = (props) => {
    
    console.log("propsssss....:", props);

    const { updateParentState, sheetRef, selectedInterval } = props;

    const [ state, setState ] = useState({
        options: [],
        updatedOptions: false
    });

    const { options } = state;

    const randomDate = (start, end) => {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    useEffect(() => {

        const newOptions = [{
            image: require("../../../../../assets/images/icon/numbers/20.png"),
            label: "15 Min Pick-Up Window",
            minutes: 15,
            subtext: `${moment(randomDate(new Date(2022, 10, 1), new Date())).format("hh:mm A")} - ${Math.floor(Math.random() * (30 - 1 + 1) + 1)} mi. away`,
            id: uuid.v4(),
            price: (Math.floor(Math.random() * (32500 - 100) + 100) / 100).toFixed(2)
        }, {
            image: require("../../../../../assets/images/icon/numbers/30.png"),
            label: "30 Min Pick-Up Window",
            minutes: 30,
            subtext: `${moment(randomDate(new Date(2022, 10, 1), new Date())).format("hh:mm A")} - ${Math.floor(Math.random() * (30 - 1 + 1) + 1)} mi. away`,
            id: uuid.v4(),
            price: (Math.floor(Math.random() * (32500 - 100) + 100) / 100).toFixed(2)
        }, {
            image: require("../../../../../assets/images/icon/numbers/45.png"),
            label: "45 Min Pick-Up Window",
            minutes: 45,
            subtext: `${moment(randomDate(new Date(2022, 10, 1), new Date())).format("hh:mm A")} - ${Math.floor(Math.random() * (30 - 1 + 1) + 1)} mi. away`,
            id: uuid.v4(),
            price: (Math.floor(Math.random() * (32500 - 100) + 100) / 100).toFixed(2)
        }, {
            image: require("../../../../../assets/images/icon/numbers/60.png"),
            label: "60 Min Pick-Up Window",
            minutes: 60,
            subtext: `${moment(randomDate(new Date(2022, 10, 1), new Date())).format("hh:mm A")} - ${Math.floor(Math.random() * (30 - 1 + 1) + 1)} mi. away`,
            id: uuid.v4(),
            price: (Math.floor(Math.random() * (32500 - 100) + 100) / 100).toFixed(2)
        }, {
            image: require("../../../../../assets/images/icon/numbers/90.png"),
            label: "90 Min Pick-Up Window",
            minutes: 90,
            subtext: `${moment(randomDate(new Date(2022, 10, 1), new Date())).format("hh:mm A")} - ${Math.floor(Math.random() * (30 - 1 + 1) + 1)} mi. away`,
            id: uuid.v4(),
            price: (Math.floor(Math.random() * (32500 - 100) + 100) / 100).toFixed(2)
        }];

        setState(prevState => {
            return {
                ...prevState,
                options: newOptions,
                updatedOptions: true
            }
        })
    }, []);

    const handleIntervalSelection = (listitem) => {
        console.log("handleIntervalSelection clicked/ran...:", listitem);

        updateParentState(prevState => {
            return {
                ...prevState,
                selectedInterval: listitem,
                closable: true
            }
        });

        sheetRef.current.close();
    }

    const calculateAppropriateStyles = (option, index) => {
        if (selectedInterval === null) {
            if (index === 0) {
                return styles.listitemSettingsTop;
            } else {
                return styles.listitemSettings;
            }
        } else {
            if (JSON.stringify(option) === JSON.stringify(selectedInterval)) {
                return styles.listitemSelectedActive;
            } else {
                if (index === 0) {
                    return styles.listitemSettingsTop;
                } else {
                    return styles.listitemSettings;
                }
            }
        }
    }
    
    return (
        <Fragment>
            {options.map((option, index) => {
                return (
                    <Fragment key={index}>
                        <ListItem onPress={() => handleIntervalSelection(option)} containerStyle={calculateAppropriateStyles(option, index)} bottomDivider>
                            <Avatar style={styles.avatarIcon} source={option.image} />
                            <ListItem.Content>
                                <ListItem.Title style={styles.labelTitleMapped}>{option.label}</ListItem.Title>
                                <ListItem.Subtitle style={styles.subLabeledMapped}>{option.subtext}</ListItem.Subtitle>
                            </ListItem.Content>
                            <Text style={styles.columnText}>${option.price}</Text>
                        </ListItem>
                    </Fragment>
                );
            })}
        </Fragment>
    );
}
export default PaneSheetSelectTransportType;