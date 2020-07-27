import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AvForm, AvField } from 'availity-reactstrap-validation';
import { Button } from 'reactstrap';
import { createVisitLog } from '../api';

export default function VisitLogForm(props) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const {register, handleSubmit} = useForm();

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const created = await createVisitLog({...data, latitude: props.visitLog.latitude, longitude: props.visitLog.longitude});
            console.log(created);
            props.onSubmit();
        } catch (err) {
            console.error(err);
            setError(err.message);
            setLoading(false);
        }
    };
    return (
        <div className="popup">
            <AvForm onSubmit={handleSubmit(onSubmit)} model={props.defaultValues}>
                { error ? <h3 className="error">{error}</h3> : null }
                <AvField required name="title" label="Title" innerRef={register}/>
                <AvField name="comments" label="Comments" type="textarea" rows={3} innerRef={register}/>
                <AvField name="description" label="Description" type="textarea" rows={3} innerRef={register}/>
                <AvField name="image" label="Image" innerRef={register}/>
                <AvField required name="visitDate" label="Date" type="date" innerRef={register}/>
                <button className='btn btn-primary submit' type='submit'>{props.update ? "Update" : "Create Entry"}</button>
            </AvForm>
        </div>
    );
}
