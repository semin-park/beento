import React, { Component } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { listLogEntries, deleteLogEntry } from './api';
import LogEntryForm from './LogEntryForm';


const MarkerSVG = (props) => {
    return (
        <svg
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

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                width: '100vw',
                height: '100vh',
                latitude: 37.5665,
                longitude: 126.9780,
                zoom: 15
            },
            logEntries: [],
            showPopup: false,
            popupTarget: null,
            formEntry: null,
        };
        this.closePopup = this.closePopup.bind(this);
        this.retrieveEntries = this.retrieveEntries.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.attachNewEntry = this.attachNewEntry.bind(this);
        this.renderAddEntry = this.renderAddEntry.bind(this);
        this.renderMarkers = this.renderMarkers.bind(this);
        this.renderPopup = this.renderPopup.bind(this);

        this.defaultPopupProps = {
            closeButton: true,
            closeOnClick: false,
            anchor: "top",
            dynamicPosition: true,
        };
    }

    closePopup() {
        this.setState({
            showPopup: false
        });
    }

    async retrieveEntries() {
        const logEntries = await listLogEntries();
        this.setState({
            logEntries: logEntries,
        });
    }

    componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(pos => {
                this.setState({
                    viewport: {
                        ...this.state.viewport,
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                    }
                });
            }, () => {
                console.log('Failed to retrieve location');
            });
        }
        this.retrieveEntries();
    }

    attachNewEntry(event) {
        if (event.target.localName === 'button')
            return;
        const [lng, lat] = event.lngLat;
        this.setState({
            formEntry: {
                latitude: lat,
                longitude: lng
            }
        });
    }

    renderEntryFormPopup(entry) {
        const props = {
            latitude: entry.latitude,
            longitude: entry.longitude,
            onClose: () => this.setState({
                formEntry: null
            }),
            ...this.defaultPopupProps,
        };
        return (
            <Popup {...props}>
                <div className="popup">
                    <LogEntryForm
                        latitude={entry.latitude}
                        longitude={entry.longitude}
                        onClose={() => {
                            this.setState({formEntry: null});
                            this.retrieveEntries();
                        }}
                    />
                </div>
            </Popup>
        );
    }

    renderAddEntry() {
        const formEntry = this.state.formEntry;
        if (!this.state.showPopup || this.state.popupTarget !== formEntry)
            return null;
        return (
            <div>
                <Marker
                    latitude={formEntry.latitude}
                    longitude={formEntry.longitude}
                >
                    <MarkerSVG color="red"/>
                </Marker>
                {this.renderEntryFormPopup(formEntry)}
            </div>
        );
    }

    renderMarkers() {
        return this.state.logEntries.map(entry => {
            return (
                <div
                    key={entry._id}
                    onClick={() => this.setState({
                        showPopup: true,
                        popupTarget: entry,
                    })}
                >
                    <Marker
                        latitude={entry.latitude}
                        longitude={entry.longitude}
                    >
                        <MarkerSVG color="yellow"/>
                    </Marker>
                    {this.renderPopup(entry)}
                </div>
            );
        })
    }

    renderPopup(entry) {
        if (this.state.showPopup && this.state.popupTarget === entry) {
            const props = {
                latitude: entry.latitude,
                longitude: entry.longitude,
                onClose: this.closePopup,
                ...this.defaultPopupProps
            };
            return (
                <Popup {...props}>
                    <div className="popup">
                        <h3>{entry.title}</h3>
                        <p>{entry.comments}</p>
                        <small>등록날짜: {new Date(entry.visitDate).toLocaleString()}</small>
                        { entry.image && <img src={entry.image} alt={entry.title}/>}
                        <button onClick={() => {
                            this.closePopup();
                        }}>Update</button>
                        <button onClick={async () => {
                            await deleteLogEntry(entry._id);
                            this.retrieveEntries();
                            this.closePopup();
                        }}>Delete</button>
                    </div>
                </Popup>
            );
        }
        return null;
    }

    render() {
        return (
            <ReactMapGL
                {...this.state.viewport}
                onViewportChange={(viewport) => this.setState({viewport: viewport})}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                mapStyle='mapbox://styles/spark9625/ckd031brp0mr51irtt15reiee'
                onClick={(event) => {
                    if (this.state.showPopup) {
                        this.setState({
                            showPopup: false,
                            popupTarget: null,
                        });
                    } else {
                        const formEntry = this.attachNewEntry(event);
                        this.setState({showPopup: true, popupTarget: this.state.formEntry});
                    }
                }}
            >
                {this.renderMarkers()}
                {this.renderAddEntry()}
            </ReactMapGL>
        );
    }
}
