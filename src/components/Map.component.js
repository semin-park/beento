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
        zoom: 3,
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
                    zoom: 15,
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

    const abortForm = () => {
        setIsFormUpdate(false);
        setLogAttempt(false);
        setFormDefault({});
    };

    const renderMarkers = () => {
        return visitLogs.map((log) => {
            return (
                <Marker
                    key={log._id}
                    latitude={log.latitude}
                    longitude={log.longitude}
                    color="default"
                    onClick={() => {
                        setPopupTarget(log);
                        abortForm()
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
            abortForm();
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
                color={isFormUpdate ? "update" : "create"}
                onClick={() => {}}
            />
        );
    };

    const [formDefault, setFormDefault] = useState({});
    const [isFormUpdate, setIsFormUpdate] = useState(false);
    const renderPopup = () => {
        let content;
        if (logAttempt) {
            content = (
                <VisitLogForm
                    visitLog={popupTarget}
                    onSubmit={() => {
                        loadVisitLogs();
                        abortForm();
                        setPopupTarget(null);
                    }}
                    defaultValues={formDefault}
                    update={isFormUpdate}
                />
            );
        } else {
            content = (
                <VisitLogContent
                    visitLog={popupTarget}
                    onMarkerUpdate={(log) => {
                        console.log(log);
                        setLogAttempt(true);
                        setIsFormUpdate(true);
                        setFormDefault({
                            title: log.title,
                            comments: log.comments,
                            description: log.description,
                            image: log.image,
                            rating: log.rating,
                            visitDate: new Date(log.visitDate),
                        });
                    }}
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
                    abortForm();
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
