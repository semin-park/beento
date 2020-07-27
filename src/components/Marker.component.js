import React from 'react';
import { Marker as ReactMapMarker } from 'react-map-gl';


const MarkerSVG = (props) => {
    return (
        <svg
            onClick={props.onClick}
            style={{
                height: '30px',
                width: '30px',
            }}
            className={`marker ${props.color}`} version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512"
        >
            <g>
                <path d="M441.443,133.2c-17.999-58.2-65.4-105.601-123.6-123.6c-20.4-6.301-41.4-9.6-61.8-9.6
                    c-41.7,0-81.899,12.9-115.499,38.101C90.742,74.7,61.043,133.2,61.043,195c0,42.599,13.5,83.101,39,117.001l156,199.999
                    l156-199.999C450.142,261,460.943,195.901,441.443,133.2z M256.043,300c-57.9,0-105-47.1-105-105s47.1-105,105-105
                    s105,47.1,105,105S313.943,300,256.043,300z"/>
            </g>
            <path d="M412.043,312.001L256.043,512V300c57.9,0,105-47.1,105-105s-47.1-105-105-105V0
                c20.4,0,41.4,3.3,61.8,9.6c58.2,17.999,105.601,65.4,123.6,123.6C460.943,195.901,450.142,261,412.043,312.001z"/>
        </svg>
    );
}

export default function Marker(props) {
    return (
        <ReactMapMarker
            latitude={props.latitude}
            longitude={props.longitude}
        >
            <MarkerSVG onClick={props.onClick} color={props.color}/>
        </ReactMapMarker>
    );
}
