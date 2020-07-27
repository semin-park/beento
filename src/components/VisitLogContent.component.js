import React from 'react';

export default function VisitLogContent(props) {
    const visitLog = props.visitLog;
    return (
        <div className="popup">
            <h3>{visitLog.title}</h3>
            <p>{visitLog.comments}</p>
            <small>등록날짜: {new Date(visitLog.visitDate).toLocaleString()}</small>
            {visitLog.image && <img src={visitLog.image} alt={visitLog.title}/>}
            <button onClick={props.onMarkerDelete}>Delete</button>
        </div>
    );
}
