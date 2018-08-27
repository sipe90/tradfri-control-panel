import React from 'react'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import { Button, Spin, Icon } from 'antd'

import { Input, Search } from 'components/form'

const fieldProps = {
    securityCode: {
        label: 'Security code',
        colon: false,
        enterButton: 'Generate',
        style: {
            width: 240
        }
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

const Spinner = <Icon type="loading" style={{ fontSize: 24 }} spin />

const renderDiscoveryStep = (props) =>
    <div>
        <div style={{ marginBottom: 16 }}>
            <p>
                You can try to discover your trådfri gateway by clicking the discovery button or input the gateway address manually yourself.
                You can freely rename the gateway if you wish.
            </p>
        </div>
        <div>
            <div style={{ display: 'inline-block', marginRight: 16, marginBottom: 0 }}>
                <Button type='primary' onClick={() => props.discoverGateway()}>Discover</Button>
            </div>
            {props.discoveryInProgress &&
                <div style={{ display: 'inline-block', marginRight: 16, marginBottom: 0 }}>
                    <Spin indicator={Spinner} />
                    <span style={{ marginLeft: 16, color: '#1890ff' }}>Looking for a gateway...</span>
                </div>
            }
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

const renderAuthenticationStep = (props) =>
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
                <Field name="securityCode" component={Search} type="text" props={{
                    validateStatus: props.identityGenerationError ? 'error' : null,
                    help: props.identityGenerationError ? props.identityGenerationError.message : null,
                    onSearch: () => props.generateIdentity(props.hostnameValue, props.securityCodeValue),
                    ...fieldProps.securityCode
                }} />
            </div>
            {props.identityGenerationInProgress &&
                <div style={{ display: 'inline-block', marginRight: 16, marginBottom: 0 }}>
                    <Spin indicator={Spinner} />
                    <span style={{ marginLeft: 16, color: '#1890ff' }}>Generating identity...</span>
                </div>
            }
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
        {step === 0 && renderDiscoveryStep(props)}
        {step === 1 && renderAuthenticationStep(props)}
        {step === 2 && renderTestConnectionStep(props)}
    </form>
}

GatewayForm.propTypes =
    renderDiscoveryStep.propTypes =
    renderAuthenticationStep.propTypes =
    renderTestConnectionStep.propTypes = {
        handleSubmit: PropTypes.func.isRequired,
        step: PropTypes.number.isRequired,
        discoverGateway: PropTypes.func.isRequired,
        generateIdentity: PropTypes.func.isRequired,
        discoveryInProgress: PropTypes.bool.isRequired,
        identityGenerationInProgress: PropTypes.bool.isRequired,
        securityCodeValue: PropTypes.string,
        hostnameValue: PropTypes.string,
        identityGenerationError: PropTypes.object
    }

export default reduxForm({ form: 'GATEWAY', destroyOnUnmount: false })(GatewayForm)
