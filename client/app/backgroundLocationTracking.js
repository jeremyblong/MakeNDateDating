import React, { useEffect } from 'react';
import {
    View
} from 'react-native';
import BackgroundGeolocation from "react-native-background-geolocation";
import { connect } from "react-redux";
import { updateLocationData } from "./actions/locationBased.js";
import axios from "axios";
import { BASE_URL } from "@env";
import _ from "lodash";

const BackgroundLocationTrackingHelper = (props) => {

    const { updateLocationData, userData } = props;
    
    const [enabled, setEnabled] = React.useState(false);
    const [location, setLocation] = React.useState('');

    const customTimerPromiseCheckAuthenticated = (limit, maxedTime, customLocation) => {

        let i = 0;
        // check readiness function helper
        const checkReadyYet = () => {
            // console.log("BackgroundLocationTrackingHelper 'checking' function logic running..: ... --- :", userData);

            if (_.has(userData, "authenticated") && Object.keys(userData).length > 0) {
                // navigate to appropriate page
                return true;
            } else {
                // not ready YET...
                return false;
            }
        };

        return new Promise((resolve) => {
            // create interval and/or timer count start
            let intervalCustomized = setInterval(() => {
                // log iteration data
                console.log(i, checkReadyYet());
                // check if ready
                if (checkReadyYet() === true) {
                    // clear timer interval
                    clearInterval(intervalCustomized);
                    // resolve pending promise
                    resolve(true);
                } else if (i === maxedTime) {
                    // clear timer interval
                    clearInterval(intervalCustomized);
                    // log change for appropriate monitoring
                    console.log("time ran out and/or expired - no data/match found for 'auth' data.");
                    // resolve negative
                    resolve(false);
                }
                i++;
            }, limit);

        }).then((passedValue) => {
            console.log("passedValue", passedValue);

            if (passedValue === true) {
                // navigate to appropriate page upon authentication recognized
                handleDBUpdateLocationOnly(customLocation);
            } 
        });
    }

    useEffect(() => {
        /// 1.  Subscribe to events.
        const onLocation = BackgroundGeolocation.onLocation((location) => {
            const parsed = location;
            console.log('[onLocation]', location);
            // set to !== if debugging
            setLocation(JSON.stringify(location, null, 2));

            if (_.has(location, "coords")) {
                console.log("location.coords.latitude :", location.coords);

                const customLoc = { latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 5, longitudeDelta: 5 };

                customTimerPromiseCheckAuthenticated(1000, 5, customLoc);
            }
        })

        const onMotionChange = BackgroundGeolocation.onMotionChange((event) => {
            console.log('[onMotionChange]', event);
        });

        const onActivityChange = BackgroundGeolocation.onActivityChange((event) => {
            console.log('[onMotionChange]', event);
        })

        const onProviderChange = BackgroundGeolocation.onProviderChange((event) => {
            console.log('[onProviderChange]', event);
        })
        const config = {
            desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
            distanceFilter: 10,
            stopTimeout: 5,
            debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
            logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
            stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
            startOnBoot: true
        }


        BackgroundGeolocation.ready(config).then(async (stateReady) => {
            console.log('- BackgroundGeolocation is ready: ', stateReady);

            if (!stateReady.enabled) {
                BackgroundGeolocation.start();
            }

            setEnabled(stateReady.enabled);

            console.log("- BackgroundGeolocation is configured and ready: ", stateReady.enabled);

        }).catch(error => {
            console.warn('- BackgroundGeolocation error: ', error);
        });

        return () => {
            onLocation.remove();
            onMotionChange.remove();
            onActivityChange.remove();
            onProviderChange.remove();
        }
    }, []);

    const handleDBUpdateLocationOnly = (location) => {
        console.log("handleDBUpdateLocationOnly running/ran...!");

        const config = {
            location,
            userID: userData.uniqueId
        };

        axios.post(`${BASE_URL}/update/partially/randomize/user/public/location`, config).then((res) => {
            
            const { updated, message } = res.data;

            if (updated === true && message === "Successfully updated user's current approx location!") {

                console.log("ressssssss location (current) data:", res.data);
            } else {
                console.log("err", res.data);
            }
        }).catch((err) => {
            console.log("err", err);
        })
    }

    useEffect(() => {
        console.log("updating", true, location);
        
        updateLocationData(location);
    }, [location]);

    return (
        <View style={{ alignItems: 'center' }} />
    )
}
const mapStateToProps = (state) => ({
    currentLocation: state.location.currentLoc,
    authData: _.has(state.auth, "tempUserData") && state.auth.tempUserData !== "undefined" ? state.auth.tempUserData : null
})
export default connect(mapStateToProps, { updateLocationData })(BackgroundLocationTrackingHelper);