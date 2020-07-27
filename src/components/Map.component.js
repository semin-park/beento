import React, { useState, useEffect } from 'react';
import ReactMapGL from 'react-map-gl';
import { listVisitLogs, deleteVisitLog } from '../api';
import Marker from './Marker.component';
import VisitLogPopup from './VisitLogPopup.component';
import VisitLogForm from './VisitLogForm.component';
import VisitLogContent from './VisitLogContent.component';


export default function Map(props) {
    const [viewport, setViewport] = useState({
        width: '100vw',
        height: '100vh',
        zoom: 15,
        latitude: 37.5665,
        longitude: 126.9780,
    });
    useEffect(function relocateViewportOnMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                setViewport({
                    ...viewport,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                });
            }, err => {
                console.log(err);
            }, {
                timeout: 10000,
                enableHighAccuracy: true,
                maximumAge: 10 * 60 * 1000 // 10m
            });
        }
    }, []);

    const viewPortChangeHandler = (vp) => {
        setViewport({
            ...vp,
            width: '100vw',
            height: '100vh',
        });
    };

    const [visitLogs, setVisitLogs] = useState([]);
    const loadVisitLogs = () => {
        listVisitLogs().then((logs) => {
            setVisitLogs(logs);
        });
    };
    useEffect(loadVisitLogs, []);

    const renderMarkers = () => {
        return visitLogs.map((log) => {
            return (
                <Marker
                    key={log._id}
                    latitude={log.latitude}
                    longitude={log.longitude}
                    color="yellow"
                    onClick={() => {
                        setLogAttempt(false);
                        setPopupTarget(log);
                    }}
                />
            );
        });
    };

    const [popupTarget, setPopupTarget] = useState(null);
    const [logAttempt, setLogAttempt] = useState(false);
    const mapClickHandler = (event) => {
        if (event.target.localName === 'button') {
            return;
        }
        if (popupTarget) {
            setLogAttempt(false);
            setPopupTarget(null);
        } else {
            const [lng, lat] = event.lngLat;
            setPopupTarget({
                latitude: lat,
                longitude: lng,
            });
            setLogAttempt(true);
        }
    };

    const renderNewMarker = () => {
        return (
            <Marker
                latitude={popupTarget.latitude}
                longitude={popupTarget.longitude}
                color="red"
                onClick={() => {}}
            />
        );
    };

    const renderPopup = () => {
        let content;
        if (logAttempt) {
            content = (
                <VisitLogForm
                    visitLog={popupTarget}
                    onSubmit={() => {
                        loadVisitLogs();
                        setLogAttempt(false);
                        setPopupTarget(null);
                    }}
                />
            );
        } else {
            content = (
                <VisitLogContent
                    visitLog={popupTarget}
                    onMarkerDelete={async () => {
                        await deleteVisitLog(popupTarget._id);
                        loadVisitLogs();
                        setPopupTarget(null);
                    }}
                />
            );
        }
        return (
            <VisitLogPopup
                visitLog={popupTarget}
                onClose={() => {
                    setLogAttempt(false);
                    setPopupTarget(null);
                }}
                render={content}
            />
        );
    };

    return (
        <ReactMapGL
            {...viewport}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            mapStyle={process.env.REACT_APP_MAPBOX_STYLE}
            onViewportChange={viewPortChangeHandler}
            onClick={mapClickHandler}
        >
            {renderMarkers()}
            {logAttempt && renderNewMarker()}
            {popupTarget && renderPopup()}
        </ReactMapGL>
    );
}
