import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AvForm, AvField, AvRadioGroup } from 'availity-reactstrap-validation';
import { createVisitLog, updateVisitLog } from '../api';
import Rating from './Rating.component';
import { AuthContext } from '../auth';

export default function VisitLogForm(props) {
    const loginInfo = useContext(AuthContext);
    const [error, setError] = useState('');
    const {register, handleSubmit} = useForm();

    const onSubmit = async (data) => {
        try {
            const userId = loginInfo.profileObj.googleId;
            let log;
            const visitLog = props.visitLog;
            if (props.update) {
                log = await updateVisitLog(userId, visitLog._id, {...data, latitude: visitLog.latitude, longitude: visitLog.longitude});
            } else {
                log = await createVisitLog(userId, {...data, latitude: visitLog.latitude, longitude: visitLog.longitude});
            }
            props.onSubmit();
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };
    return (
        <div className="popup">
            <AvForm onSubmit={handleSubmit(onSubmit)} model={props.defaultValues}>
                { error ? <h3 className="error">{error}</h3> : null }
                <AvField required name="title" label="Title" innerRef={register({required: true})}/>
                <AvField name="comments" label="Comments" type="textarea" rows={3} innerRef={register}/>
                <AvField name="description" label="Description" type="textarea" rows={3} innerRef={register}/>
                <AvField name="image" label="Image" innerRef={register}/>
                <AvRadioGroup name="rating">
                    <Rating innerRef={register} />
                </AvRadioGroup>
                <AvField required name="visitDate" label="Date" type="date" innerRef={register({required: true})}/>
                <button className='btn btn-primary submit' type='submit'>{props.update ? "Update" : "Create Entry"}</button>
            </AvForm>
        </div>
    );
}
