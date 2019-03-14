import React from 'react';

const Username = (props) => {

    return (
        <div>

            <form onClick={props.onClick}>
                <input
                    type="text"
                    placeholder="Username"
                    value={props.value}
                    onChange={props.onChange}
                    className="form-control" />
            </form>

        </div>

    );

}

export default Username;