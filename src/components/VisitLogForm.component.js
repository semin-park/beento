import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createVisitLog } from '../api';

export default function VisitLogForm(props) {
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState('');
    const { register, handleSubmit } = useForm();

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
        <form className="entry-form" onSubmit={handleSubmit(onSubmit)}>
            { error ? <h3 className="error">{error}</h3> : null }
            <div>
                <label htmlFor="logEntryFormTitle">Title</label>
                <input ref={register} name="title" id="logEntryFormTitle" type="text" required/>
            </div>
            <div>
                <label htmlFor="logEntryFormComments">Comments</label>
                <textarea ref={register} name="comments" id="logEntryFormComments" rows={3}/>
            </div>
            <div>
                <label htmlFor="logEntryFormDescription">Description</label>
                <textarea ref={register} name="description" id="logEntryFormDescription" rows={3}/>
            </div>
            <div>
                <label htmlFor="logEntryFormImage">Image</label>
                <input ref={register} name="image" id="logEntryFormImage"/>
            </div>
            <div>
                <label htmlFor="logEntryFormVisitDate">Date</label>
                <input ref={register} name="visitDate" id="logEntryFormVisitDate" type="date" required/>
            </div>
            <button disabled={loading}>{loading ? "Loading..." : "Create Entry"}</button>
        </form>
    );
}
