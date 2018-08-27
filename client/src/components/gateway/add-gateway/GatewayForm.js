import React from 'react'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import { Button, Spin } from 'antd'

import { Input } from 'components/form'

const fieldProps = {
    securityCode: {
        label: 'Security code',
        colon: false
    },
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

const renderDiscoveryStep = () =>
    <div>
        <div style={{ marginBottom: 16 }}>
            <p>
                You can try to discover your trådfri gateway by clicking the discovery button or input the gateway address manually yourself.
                You can freely rename the gateway if you wish.
            </p>
        </div>
        <div>
            <div style={{ display: 'inline-block', marginRight: 16, marginBottom: 0 }}>
                <Button type='primary' >Discover</Button>
            </div>
            <div style={{ display: 'inline-block', marginRight: 16, marginBottom: 0 }}>
                <Spin />
            </div>
        </div>
        <div>
            <div style={{ display: 'inline-block', marginRight: 16, marginBottom: 0 }}>
                <Field name="name" component={Input} type="text" props={fieldProps.name} />
            </div>
            <div style={{ display: 'inline-block', marginRight: 16, marginBottom: 0 }}>
                <Field name="hostname" component={Input} type="text" props={fieldProps.hostname} />
            </div>
        </div>
    </div>

const renderAuthenticationStep = () =>
    <div>
        <div style={{ marginBottom: 16 }}>
            <p>
                You will need to generate an identity to authenticate Trådfri Control Panel with your gateway.
                You can generate an identity/psk pair by inputting the security code imprinted in the gateway and clicking the authenticate button.
            </p>
            <p>
                If you already have a generated identity, you can input them directly.
            </p>
        </div>
        <div>
            <div style={{ display: 'inline-block', marginRight: 16, marginBottom: 0 }}>
                <Field name="securityCode" component={Input} type="text" props={fieldProps.securityCode} />
            </div>
            <div style={{ display: 'inline-block', marginRight: 16, marginBottom: 0 }}>
                <Button type='primary' >Authenticate</Button>
            </div>
            <div style={{ display: 'inline-block', marginRight: 16, marginBottom: 0 }}>
                <Spin />
            </div>
        </div>
        <div>
            <div style={{ display: 'inline-block', marginRight: 16, marginBottom: 0 }}>
                <Field name="identity" component={Input} type="text" props={fieldProps.identity} />
            </div>
            <div style={{ display: 'inline-block', marginRight: 16, marginBottom: 0 }}>
                <Field name="psk" component={Input} type="text" props={fieldProps.psk} />
            </div>
        </div>
    </div>

const renderTestConnectionStep = () =>
    <div>
    </div>

const GatewayForm = (props) => {
    const { handleSubmit, step } = props
    return <form onSubmit={handleSubmit}>
        {step === 0 && renderDiscoveryStep()}
        {step === 1 && renderAuthenticationStep()}
        {step === 2 && renderTestConnectionStep()}
    </form>
}

GatewayForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    step: PropTypes.number.isRequired
}

export default reduxForm({ form: 'GATEWAY', destroyOnUnmount: false })(GatewayForm)
