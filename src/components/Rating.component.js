import React from 'react';

const Star = (props) => {
    const className = (Math.floor(props.target) === props.target) ? "full" : "half";
    if (props.fixed) {
        return (
            <>
            <input readOnly checked={props.value === props.target} type="radio" id={`star${props.target}`} name="rating" value={props.target} />
            <label className={className} htmlFor={`star${props.target}`}></label>
            </>
        );
    } else {
        return (
            <>
            <input ref={props.innerRef} type="radio" id={`star${props.target}`} name="rating" value={props.target} />
            <label className={className} htmlFor={`star${props.target}`}></label>
            </>
        );
    }
};

export default function Rating(props) {
    return (
        <div className="text-center">
            <fieldset className={props.fixed ? "rating" : "rating active"}>
                {
                    [...Array(10).keys()].map(x => {
                        return <Star {...props} target={(10 - x) / 2}/>
                    })
                }
            </fieldset>
        </div>
    );
};
