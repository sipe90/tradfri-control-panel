import React from 'react'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'

import { Input } from 'components/form'

const fieldProps = {
    name: {
        label: 'Gateway name',
        colon: false
    },
    hostname: {
        label: 'Gateway address',
        colon: false
    },
    identity: {
        label: 'Identity',
        colon: false
    },
    psk: {
        label: 'Pre-shared key',
        colon: false
    }
}

let GatewayForm = (props) => {
    const { handleSubmit, step } = props
    return <form onSubmit={handleSubmit}>
        {step === 0 &&
            <div>
                <div style={{ display: 'inline-block', marginRight: 16, marginBottom: 0 }}>
                    <Field name="name" component={Input} type="text" props={fieldProps.name} />
                </div>
                <div style={{ display: 'inline-block', marginRight: 16, marginBottom: 0 }}>
                    <Field name="hostname" component={Input} type="text" props={fieldProps.hostname} />
                </div>
            </div>
        }
        {step === 1 &&
            <div>
                <div style={{ display: 'inline-block', marginRight: 16, marginBottom: 0 }}>
                    <Field name="identity" component={Input} type="text" props={fieldProps.identity} />
                </div>
                <div style={{ display: 'inline-block', marginRight: 16, marginBottom: 0 }}>
                    <Field name="psk" component={Input} type="text" props={fieldProps.psk} />
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
