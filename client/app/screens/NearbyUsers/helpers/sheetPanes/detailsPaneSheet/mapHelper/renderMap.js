import React from "react";
import MapView, { Marker } from "react-native-maps";

const GoogleMapRenderHelper = ({ latitude, longitude, height, pinColor }) => {
    return (
        <MapView
            style={{ height: height }}
            initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.0085,
                longitudeDelta: 0.0085,
            }}
        >
            <Marker
                coordinate={{ latitude, longitude }}
                pinColor={pinColor}
            />
        </MapView>
    )
}

export default GoogleMapRenderHelper;