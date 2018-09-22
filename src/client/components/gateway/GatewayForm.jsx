import React from 'react'
import { Field } from 'redux-form'
import PropTypes from 'prop-types'
import { Button, Spin, Icon, Table } from 'antd'
import * as R from 'ramda'

import { Input, Search } from 'components/form'
import { required } from 'validators'

import 'components/gateway/GatewayForm.css'

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

const columns = [{
    title: 'Name',
    dataIndex: 'name'
}, {
    title: 'Host',
    dataIndex: 'host'
}, {
    title: 'Addresses',
    dataIndex: 'addresses',
    render: function renderAddresses([ipv4, ipv6]) { return <span>{ipv4}<br />{ipv6}</span> }
}, {
    title: 'Version',
    dataIndex: 'version'
}]

const Spinner = <Icon type='loading' className='spinner-icon' spin />

const renderDiscoveryStep = (props) =>
    <div>
        <div className='form-section__content'>
            <div>
                <p>
                    You can try to discover your trådfri gateway by clicking the discovery button or input the gateway address manually yourself.
                    You can freely rename the gateway if you wish.
                </p>
            </div>
            <div className='discovery__discover'>
                <div>
                    <Button type='primary'
                        onClick={() => props.discoverGateway()}
                        disabled={props.discoveryInProgress}>
                        Discover
                    </Button>
                </div>
                {props.discoveryInProgress &&
                    <div className='discovery__status'>
                        <Spin indicator={Spinner} />
                        <span className='status-text'>Looking for a gateway...</span>
                    </div>
                }
            </div>
            <div>
                <div className='discovery__table-header'>Discovered gateway</div>
                <Table size='small'
                    columns={columns}
                    dataSource={props.discoveredGateway ? [props.discoveredGateway] : []}
                    pagination={false}
                    rowKey='name' />
            </div>
            <div className='discovery__input'>
                <div>
                    <Field name='name' validate={required} component={Input} type='text' props={fieldProps.name} />
                </div>
                <div>
                    <Field name='hostname' validate={required} component={Input} type='text' props={fieldProps.hostname} />
                </div>
            </div>
        </div>
        <div className='form-section__button-row'>
            <div>
                <Button
                    type='primary'
                    onClick={props.nextStep}
                    disabled={props.validationErrors.name || props.validationErrors.hostname}>
                    Next
                </Button>
            </div>
        </div>
    </div>

const renderAuthenticationStep = (props) =>
    <div>
        <div className='form-section__content'>
            <div>
                <p>
                    You will need to generate an identity to authenticate Trådfri Control Panel with your gateway.
                    You can generate an identity/psk pair by inputting the security code imprinted in the gateway and clicking the authenticate button.
                </p>
                <p>
                    If you already have a generated identity, you can input them directly.
                </p>
            </div>
            <div className='auth__security-code'>
                <div>
                    <Field name='securityCode' component={Search} type='text' props={{
                        validateStatus: props.identityGenerationError ? 'error' : null,
                        help: props.identityGenerationError ? props.identityGenerationError.message : null,
                        onSearch: () => props.generateIdentity(props.hostnameValue, props.securityCodeValue),
                        ...fieldProps.securityCode
                    }} />
                </div>
                {props.identityGenerationInProgress &&
                    <div className='auth__status'>
                        <Spin indicator={Spinner} />
                        <span className='status-text'>Generating identity...</span>
                    </div>
                }
            </div>
            <div className='auth__input'>
                <div>
                    <Field name='identity' validate={required} component={Input} type='text' props={fieldProps.identity} />
                </div>
                <div>
                    <Field name='psk' validate={required} component={Input} type='text' props={fieldProps.psk} />
                </div>
            </div>
        </div>
        <div className='form-section__button-row'>
            <div>
                <Button
                    onClick={props.previousStep}>
                    Previous
                </Button>
            </div>
            <div>
                <Button
                    type='primary'
                    onClick={props.nextStep}
                    disabled={!R.isEmpty(props.validationErrors)}>
                    Next
                </Button>
            </div>
        </div>
    </div>

const renderTestConnectionStep = (props) =>
    <div>
        <div className='form-section__content'>
            <div>
                <p>
                    Finished! Now finish by trying to connect to the gateway. Clicking finish will save the gateway information.
                </p>
            </div>
            <div className='test__content'>
                <div>
                    <Button type='primary' onClick={() => props.testConnection(props.hostnameValue, props.identityValue, props.pskValue)}>Test connection</Button>
                </div>
                {props.connectionTestInProgress &&
                    <div>
                        <Spin indicator={Spinner} />
                        <span className='status-text'>Connecting to gateway...</span>
                    </div>
                }
                {props.connectionTestResult &&
                    <div>
                        {props.connectionTestResult.success ?
                            <span className='test__status--success'>Successfully connected to gateway!</span> : <span className='test__status--failure'>Failed to connect to gateway</span>
                        }
                    </div>
                }
            </div>
        </div>
        <div className='form-section__button-row'>
            <div>
                <Button
                    onClick={props.previousStep}>
                    Previous
                </Button>
            </div>
            <div>
                <Button
                    onClick={props.handleSubmit(props.saveGateway)}
                    type='primary'
                    htmlType='submit'
                    disabled={props.submitting || !R.path(['connectionTestResult', 'success'], props)}>
                    Finish
                </Button>
            </div>
        </div>
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
        submitting: PropTypes.bool.isRequired,
        step: PropTypes.number.isRequired,
        nextStep: PropTypes.func.isRequired,
        previousStep: PropTypes.func.isRequired,
        discoverGateway: PropTypes.func.isRequired,
        generateIdentity: PropTypes.func.isRequired,
        testConnection: PropTypes.func.isRequired,
        saveGateway: PropTypes.func.isRequired,
        discoveryInProgress: PropTypes.bool.isRequired,
        identityGenerationInProgress: PropTypes.bool.isRequired,
        connectionTestInProgress: PropTypes.bool.isRequired,
        securityCodeValue: PropTypes.string,
        hostnameValue: PropTypes.string,
        identityValue: PropTypes.string,
        pskValue: PropTypes.string,
        identityGenerationError: PropTypes.object,
        discoveredGateway: PropTypes.object,
        connectionTestResult: PropTypes.object,
        validationErrors: PropTypes.object
    }

export default GatewayForm
