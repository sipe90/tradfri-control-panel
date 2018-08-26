import React from 'react'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'

let GatewayForm = (props) => {
    const { handleSubmit, step } = props
    return <form onSubmit={handleSubmit}>
        {step === 0 &&
            <div>
                <div>
                    <label htmlFor="name">Gateway name</label>
                    <Field name="name" component="input" type="text" />
                </div>
                <div>
                    <label htmlFor="hostname">Gateway address</label>
                    <Field name="hostname" component="input" type="text" />
                </div>
            </div>
        }
        {step === 1 &&
            <div>
                <div>
                    <label htmlFor="identity">Identity</label>
                    <Field name="identity" component="input" type="text" />
                </div>
                <div>
                    <label htmlFor="psk">Pre-shared key</label>
                    <Field name="psk" component="input" type="text" />
                </div>
            </div>
        }
    </form>
}

GatewayForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    step: PropTypes.number.isRequired
}

export default reduxForm({ form: 'GATEWAY' })(GatewayForm)
