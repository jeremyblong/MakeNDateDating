import React, { Fragment, useRef, useState, useEffect } from "react";
import { View, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Text, Header, Icon, Button, TextInput } from "@components";
import { useTheme, BaseColor } from '@config';
import { useNavigation } from "@react-navigation/native";
import Markdown from 'react-native-showdown';
import styles from "./viewAdditionalInfoStyles.js";
      
const css = `body {
    font-family: Helvetica, arial, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: white;
    padding: 30px;
    color: #333;
  }
  
  body > *:first-child {
    margin-top: 0 !important;
  }
  
  body > *:last-child {
    margin-bottom: 0 !important;
  }
  
  a {
    color: #4183C4;
    text-decoration: none;
  }
  
  a.absent {
    color: #cc0000;
  }
  
  a.anchor {
    display: block;
    padding-left: 30px;
    margin-left: -30px;
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin: 20px 0 10px;
    padding: 0;
    font-weight: bold;
    -webkit-font-smoothing: antialiased;
    cursor: text;
    position: relative;
  }
  
  h2:first-child, h1:first-child, h1:first-child + h2, h3:first-child, h4:first-child, h5:first-child, h6:first-child {
    margin-top: 0;
    padding-top: 0;
  }
  
  h1:hover a.anchor, h2:hover a.anchor, h3:hover a.anchor, h4:hover a.anchor, h5:hover a.anchor, h6:hover a.anchor {
    text-decoration: none;
  }
  
  h1 tt, h1 code {
    font-size: inherit;
  }
  
  h2 tt, h2 code {
    font-size: inherit;
  }
  
  h3 tt, h3 code {
    font-size: inherit;
  }
  
  h4 tt, h4 code {
    font-size: inherit;
  }
  
  h5 tt, h5 code {
    font-size: inherit;
  }
  
  h6 tt, h6 code {
    font-size: inherit;
  }
  
  h1 {
    font-size: 28px;
    color: black;
  }
  
  h2 {
    font-size: 24px;
    border-bottom: 1px solid #cccccc;
    color: black;
  }
  
  h3 {
    font-size: 18px;
  }
  
  h4 {
    font-size: 16px;
  }
  
  h5 {
    font-size: 14px;
  }
  
  h6 {
    color: #777777;
    font-size: 14px;
  }
  
  p, blockquote, ul, ol, dl, li, table, pre {
    margin: 15px 0;
  }
  
  hr {
    border: 0 none;
    color: #cccccc;
    height: 4px;
    padding: 0;
  }
  
  body > h2:first-child {
    margin-top: 0;
    padding-top: 0;
  }
  
  body > h1:first-child {
    margin-top: 0;
    padding-top: 0;
  }
  
  body > h1:first-child + h2 {
    margin-top: 0;
    padding-top: 0;
  }
  
  body > h3:first-child, body > h4:first-child, body > h5:first-child, body > h6:first-child {
    margin-top: 0;
    padding-top: 0;
  }
  
  a:first-child h1, a:first-child h2, a:first-child h3, a:first-child h4, a:first-child h5, a:first-child h6 {
    margin-top: 0;
    padding-top: 0;
  }
  
  h1 p, h2 p, h3 p, h4 p, h5 p, h6 p {
    margin-top: 0;
  }
  
  li p.first {
    display: inline-block;
  }
  
  ul, ol {
    padding-left: 30px;
  }
  
  ul :first-child, ol :first-child {
    margin-top: 0;
  }
  
  ul :last-child, ol :last-child {
    margin-bottom: 0;
  }
  
  dl {
    padding: 0;
  }
  
  dl dt {
    font-size: 14px;
    font-weight: bold;
    font-style: italic;
    padding: 0;
    margin: 15px 0 5px;
  }
  
  dl dt:first-child {
    padding: 0;
  }
  
  dl dt > :first-child {
    margin-top: 0;
  }
  
  dl dt > :last-child {
    margin-bottom: 0;
  }
  
  dl dd {
    margin: 0 0 15px;
    padding: 0 15px;
  }
  
  dl dd > :first-child {
    margin-top: 0;
  }
  
  dl dd > :last-child {
    margin-bottom: 0;
  }
  
  blockquote {
    border-left: 4px solid #dddddd;
    padding: 0 15px;
    color: #777777;
  }
  
  blockquote > :first-child {
    margin-top: 0;
  }
  
  blockquote > :last-child {
    margin-bottom: 0;
  }
  
  table {
    padding: 0;
  }
  table tr {
    border-top: 1px solid #cccccc;
    background-color: white;
    margin: 0;
    padding: 0;
  }
  
  table tr:nth-child(2n) {
    background-color: #f8f8f8;
  }
  
  table tr th {
    font-weight: bold;
    border: 1px solid #cccccc;
    text-align: left;
    margin: 0;
    padding: 6px 13px;
  }
  
  table tr td {
    border: 1px solid #cccccc;
    text-align: left;
    margin: 0;
    padding: 6px 13px;
  }
  
  table tr th :first-child, table tr td :first-child {
    margin-top: 0;
  }
  
  table tr th :last-child, table tr td :last-child {
    margin-bottom: 0;
  }
  
  img {
    max-width: 100%;
  }
  
  span.frame {
    display: block;
    overflow: hidden;
  }
  
  span.frame > span {
    border: 1px solid #dddddd;
    display: block;
    float: left;
    overflow: hidden;
    margin: 13px 0 0;
    padding: 7px;
    width: auto;
  }
  
  span.frame span img {
    display: block;
    float: left;
  }
  
  span.frame span span {
    clear: both;
    color: #333333;
    display: block;
    padding: 5px 0 0;
  }
  
  span.align-center {
    display: block;
    overflow: hidden;
    clear: both;
  }
  
  span.align-center > span {
    display: block;
    overflow: hidden;
    margin: 13px auto 0;
    text-align: center;
  }
  
  span.align-center span img {
    margin: 0 auto;
    text-align: center;
  }
  
  span.align-right {
    display: block;
    overflow: hidden;
    clear: both;
  }
  
  span.align-right > span {
    display: block;
    overflow: hidden;
    margin: 13px 0 0;
    text-align: right;
  }
  
  span.align-right span img {
    margin: 0;
    text-align: right;
  }
  
  span.float-left {
    display: block;
    margin-right: 13px;
    overflow: hidden;
    float: left;
  }
  
  span.float-left span {
    margin: 13px 0 0;
  }
  
  span.float-right {
    display: block;
    margin-left: 13px;
    overflow: hidden;
    float: right;
  }
  
  span.float-right > span {
    display: block;
    overflow: hidden;
    margin: 13px auto 0;
    text-align: right;
  }
  
  code, tt {
    margin: 0 2px;
    padding: 0 5px;
    white-space: nowrap;
    border: 1px solid #eaeaea;
    background-color: #f8f8f8;
    border-radius: 3px;
  }
  
  pre code {
    margin: 0;
    padding: 0;
    max-width: 100%;
    white-space: pre;
    border: none;
    background: transparent;
  }
  
  .highlight pre {
    background-color: #f8f8f8;
    border: 1px solid #cccccc;
    font-size: 13px;
    line-height: 19px;
    overflow: auto;
    padding: 6px 10px;
    border-radius: 3px;
  }
  
  pre {
    background-color: #f8f8f8;
    border: 1px solid #cccccc;
    font-size: 13px;
    line-height: 19px;
    overflow: auto;
    padding: 6px 10px;
    border-radius: 3px;
  }
  
  pre code, pre tt {
    background-color: transparent;
    border: none;
}`

const BacheloretteConfirmationAboutPageComponent = () => {

    const { colors, theme } = useTheme();
    const navigation = useNavigation();
    const colorSchemeDark = theme.dark;

    return (
        <Fragment>
            <Header
                title={"How It Works!"}
                subTitle="How this competition works..."
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
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                <View style={styles.container}>
                    <Markdown markdown={`## Welcome to our dating competition!

This game is a **friendly** competition for the main user's love, friendship, connection & more... To ensure the game goes well for you, make sure to stay on your toes and be **respectful** and **courteous** to other user's, even if things aren't going that great.

**NOTE:** Dates can be in-person **or** virtually depending if user's are local or not. This is totally up to the discretion of the main leading user (the game leader)

# Rules & how it works... 

1. The candidates will all apply and be **selected** or not **prior** (you'll continuously be updated/notified upon various changes occurring throughout the events) to the start of the competition...
2. Once the **main** user selects all participating candidates/users, the picked and **unselected** users will BOTH be notified. The games will then begin...!
3. You will play a variety of games including but not limited to virtual/in-person dates, Q&A games & more... This helps the **the game leader** decide who is going to be a better match and how to better understand each participating individual on a deeper more meaningful level.
4. There will be numerous elimination rounds (3 TOTAL) before a final decision must be made - these are each after a different/another event like Q&A guessing rounds, virtual/in-person dates, etc...
5. You will be participating for **BOTH** the right to date and explore future possibilities with the **the game leader** down the road **AND** whatever the wagged token amount from the main user set it as (this can be up-to a $25.00 value which is split and paid between the main user & us as the platform)
6. The game will proceed and **candidates will be removed through each round** - you must make it through **ALL** ROUNDS in order to be a potential candidate for the final round/process...
7. The **MAIN USER (the game leader)** will have to eliminate 1/4 of each batch of user's upon the completion of each round leaving 1/4 left for the final decision. Please keep this in mind in your strategy and plan to land a win!
8. The competition will start 7 days from NOW, you will recieve updates as they become available but be on the app around the day of initialization...
-

-`} css={css} />
                    </View>
                </View>
                <View style={styles.footer}>
                    <View style={styles.hr} />
                    <Button style={{ width: "100%" }} outline onPress={() => navigation.replace("BottomTabNavigator", { screen: "Profile" })}>
                        {"Continue/Proceed..."}
                    </Button>
                </View>
            </View>
        </Fragment>
    );
};

export default BacheloretteConfirmationAboutPageComponent;
