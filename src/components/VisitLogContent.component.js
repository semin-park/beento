import React from 'react';

export default function VisitLogContent(props) {
    const visitLog = props.visitLog;
    return (
        <div className="popup">
            <h3 className="text-center">{visitLog.title}</h3>
            <hr/>
            <p className="text-center">{visitLog.comments}</p>
            {visitLog.image && <img src={visitLog.image} alt={visitLog.title}/>}
            <small className="text-center">등록날짜: {new Date(visitLog.visitDate).toLocaleString()}</small>
            <hr/>
            <div className="text-center">
                <button className='btn btn-outline-secondary' onClick={() => props.onMarkerUpdate(visitLog)}>Update</button>
                <button className='btn btn-outline-danger ml-2' onClick={props.onMarkerDelete}>Delete</button>
            </div>
        </div>
    );
}
