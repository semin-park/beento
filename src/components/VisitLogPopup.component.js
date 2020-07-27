import React from 'react';
import { Popup } from 'react-map-gl';

export default function VisitLogPopup(props) {
    const popupProps = {
        latitude: props.visitLog.latitude,
        longitude: props.visitLog.longitude,
        onClose: props.onClose,
        closeButton: true,
        closeOnClick: false,
        anchor: "top",
        dynamicPosition: true,
    };
    return (
        <Popup {...popupProps}>
            {props.render}
        </Popup>
    );
}
