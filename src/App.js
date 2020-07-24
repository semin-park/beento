import React, { Component } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { listLogEntries } from './api';
import LogEntryForm from './LogEntryForm';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                width: '100vw',
                height: '100vh',
                latitude: 37.5665,
                longitude: 126.9780,
                zoom: 12
            },
            logEntries: [],
            showPopup: {},
            newEntry: null,
        };
        this.renderMarkers = this.renderMarkers.bind(this);
        this.renderPopup = this.renderPopup.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.showAddEntryPopup = this.showAddEntryPopup.bind(this);
        this.renderAddEntryPopup = this.renderAddEntryPopup.bind(this);
        this.getEntries = this.getEntries.bind(this);
    }

    getEntries() {
        listLogEntries().then((logEntries) => {
            this.setState({
                logEntries: logEntries,
            });
        });
    }

    componentDidMount() {
        this.getEntries();
    }

    showAddEntryPopup(event) {
        if (event.target.localName === 'button')
            return;
        const [lng, lat] = event.lngLat;
        this.setState({
            newEntry: {
                latitude: lat,
                longitude: lng
            }
        });
    }

    renderAddEntryPopup() {
        const newEntry = this.state.newEntry;
        if (newEntry === null) 
            return null;
        return (
            <div>
                <Marker
                    latitude={newEntry.latitude}
                    longitude={newEntry.longitude}
                >
                    <svg
                        style={{
                            height: '30px',
                            width: '30px',
                        }}
                        className="marker red" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512"
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
                </Marker>
                <Popup
                    latitude={newEntry.latitude}
                    longitude={newEntry.longitude}
                    closeButton={true}
                    closeOnClick={false}
                    onClose={() => this.setState({
                        newEntry: null
                    })}
                    anchor="top"
                    dynamicPosition={true}
                >
                    <div className="popup">
                        <LogEntryForm onClose={() => {
                            this.setState({
                                newEntry: null
                            });
                            this.getEntries();
                        }} latitude={newEntry.latitude} longitude={newEntry.longitude} />
                    </div>
                </Popup>
            </div>
        );
    }

    renderMarkers() {
        return this.state.logEntries.map(entry => {
            return (
                <div
                    key={entry._id}
                    onClick={() => this.setState({
                        showPopup: {[entry._id]: true}
                    })}
                >
                    <Marker
                        latitude={entry.latitude}
                        longitude={entry.longitude}
                    >
                        <svg
                            style={{
                                height: '30px',
                                width: '30px',
                            }}
                            className="marker yellow" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512"
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
                    </Marker>
                    {this.renderPopup(entry)}
                </div>
            );
        })
    }

    renderPopup(entry) {
        if (this.state.showPopup[entry._id])
            return (
                <Popup
                    latitude={entry.latitude}
                    longitude={entry.longitude}
                    closeButton={true}
                    closeOnClick={false}
                    onClose={() => this.setState({
                        showPopup: {}
                    })}
                    anchor="top"
                    dynamicPosition={true}
                >
                    <div className="popup">
                        <h3>{entry.title}</h3>
                        <p>{entry.comments}</p>
                        <small>등록날짜: {new Date(entry.visitDate).toLocaleString()}</small>
                { entry.image && <img src={entry.image} alt={entry.title}/>}
                    </div>
                </Popup>
            );
        return null;
    }

    render() {
        return (
            <ReactMapGL
                {...this.state.viewport}
                onViewportChange={(viewport) => this.setState({viewport})}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                mapStyle='mapbox://styles/spark9625/ckd031brp0mr51irtt15reiee'
                onClick={this.showAddEntryPopup}
            >
                {this.renderMarkers()}
                {this.renderAddEntryPopup()}
            </ReactMapGL>
        );
    }
}
