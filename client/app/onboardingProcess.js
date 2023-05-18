import React, { Fragment, useEffect, useState } from "react";
import { OnboardFlow } from 'react-native-onboard';
import { introShown } from "./actions/introCompleted.js";
import { connect, useDispatch } from "react-redux";
import { ApplicationActions } from '@actions';
import { StatusBar, Dimensions } from "react-native";


const { width, height } = Dimensions.get("window");

console.log("this is the height", height);

const OnboardingProcess = ({ completedAlready, introShown }) => {
    // state items...
    const [ ready, setReady ] = useState(false);
    const dispatch = useDispatch();

    const onChange = forceDarkMode => {
        dispatch(ApplicationActions.onForceTheme(forceDarkMode));
        StatusBar.setBackgroundColor("#000", true);
    };

    useEffect(() => { 
        // set ready to display or not if initial render...
        setReady(true);
    }, []);
    // return main JSX logic..
    return (
        <Fragment>
            {(completedAlready === "undefined" || completedAlready !== true) && ready === true ? <OnboardFlow
                // style={{ maxHeight: }}
                pages={[
                    {
                        title: 'Welcome To The\nMakeNDate Dating App!',
                        subtitle: 'We are the most comprehensive dating app available, providing you with features and capabilities that extend your chances for genuine connection, companionship & relationships!',
                        imageUri: 'https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/logo.png',
                    },
                    {
                        title: 'Social-Style Open Dating Application',
                        subtitle: 'Get together with fresh faces in a fun and unique gaming atmosphere and get rewarded just for using the app! Purchase or earn tokens and find your perfect partner.',
                        imageUri: 'https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/online-dating-and-social-networking-with-a-couple-leaning-against-each-other-and-chatting-via-their-smartphone-flat-style-illustration-vector.jpg',
                    },
                    {
                        title: `Token's are earned in-app & cashed out for real money!`,
                        subtitle: `Tokens, the in-app currency, hold value and can be earned or spent. They're convertible to USD. Explore the app to discover earning methods.`,
                        imageUri: 'https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/coin-and-vault.png',
                    },
                    {
                        title: 'More Extensive Features & Funcionality',
                        subtitle: 'The most comprehensive dating app, followers/following, guided mentorship, feed posts, live-streaming, random 1v1/group chats, matches, IRL meetups & more.',
                        imageUri: 'https://dating-blockchain-mobile-app.s3.us-west-2.amazonaws.com/Dating-Illustration.jpg',
                    }
                ]}
                enableScroll={true}
                pageStyle={ height <= 700 ? { maxHeight: height * 0.425, top: 0 } : {}}
                onDone={() => {
                    console.log("done");
                    // global redux state...
                    // onChange(true);
                    // complete intro
                    introShown(true);
                }}
                type={'fullscreen'}
            /> : null}
        </Fragment>
    );
}
const mapStateToProps = state => {
    return {

    }
}
export default connect(mapStateToProps, { introShown })(OnboardingProcess);