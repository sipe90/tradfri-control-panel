import { Button, Spin, Table } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { DiscoveredGateway } from 'node-tradfri-client'
import * as R from 'ramda'
import React from 'react'
import { Field, FormErrors, InjectedFormProps } from 'redux-form'

import { Input, Search } from '@/components/form'
import { required } from '@/validators'

import { IConnectionTestResult } from '@/types'
import { ColumnProps } from 'antd/lib/table'

import './GatewayWizardForm.css'
import Spinner from '../Spinner'

export interface IGatewayWizardFormValues {
    name: string
    hostname: string
    identity: string
    psk: string
    securityCode: string
}

export interface IGatewayWizardFormProps {
    step: number
    nextStep: () => void
    previousStep: () => void
    discoverGateway: () => void
    generateIdentity: (hostname: string, securityCode: string) => void
    testConnection: (hostname: string, identity: string, psk: string) => void
    saveGateway: (gateway: IGatewayWizardFormValues) => void
    discoveryInProgress: boolean
    identityGenerationInProgress: boolean
    connectionTestInProgress: boolean
    securityCodeValue: string
    hostnameValue: string
    identityValue: string
    pskValue: string
    identityGenerationError: any
    discoveredGateway: DiscoveredGateway | null
    connectionTestResult: IConnectionTestResult | null
    validationErrors: FormErrors<IGatewayWizardFormValues>
}

type AllProps = IGatewayWizardFormProps & InjectedFormProps<IGatewayWizardFormValues, IGatewayWizardFormProps>

const fieldProps = {
    hostname: {
        colon: false,
        label: 'Gateway address',
    },
    identity: {
        colon: false,
        label: 'Identity',
    },
    name: {
        colon: false,
        label: 'Gateway name',
    },
    psk: {
        colon: false,
        label: 'Pre-shared key',
    },
    securityCode: {
        colon: false,
        enterButton: 'Generate',
        label: 'Security code',
        style: {
            width: 240,
        },
    },
}

const columns: Array<ColumnProps<DiscoveredGateway>> = [{
    dataIndex: 'name',
    title: 'Name',
}, {
    dataIndex: 'host',
    title: 'Host',
}, {
    dataIndex: 'addresses',
    render: function renderAddresses([ipv4, ipv6]: [string, string]) { return <span>{ipv4}<br />{ipv6}</span> },
    title: 'Addresses',
}, {
    dataIndex: 'version',
    title: 'Version',
}]

const DiscoveryStep: React.FC<AllProps> = (props) => (
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
                    <Button
                        type='primary'
                        onClick={() => props.discoverGateway()}
                        disabled={props.discoveryInProgress}
                    >
                        Discover
                    </Button>
                </div>
                {props.discoveryInProgress &&
                    <div className='discovery__status'>
                        <Spinner spinning />
                        <span className='status-text'>Looking for a gateway...</span>
                    </div>
                }
            </div>
            <div>
                <div className='discovery__table-header'>Discovered gateway</div>
                <Table
                    size='small'
                    columns={columns}
                    dataSource={props.discoveredGateway ? [props.discoveredGateway] : []}
                    pagination={false}
                    rowKey='name'
                />
            </div>
            <div className='discovery__input'>
                <div>
                    <Field
                        name='name'
                        validate={required}
                        component={Input}
                        type='text'
                        props={fieldProps.name}
                    />
                </div>
                <div>
                    <Field
                        name='hostname'
                        validate={required}
                        component={Input}
                        type='text'
                        props={fieldProps.hostname}
                    />
                </div>
            </div>
        </div>
        <div className='form-section__button-row'>
            <div>
                <Button
                    type='primary'
                    onClick={props.nextStep}
                    disabled={props.validationErrors.name != null || props.validationErrors.hostname != null}>
                    Next
                </Button>
            </div>
        </div>
    </div>
)

const AuthenticationStep: React.FC<AllProps> = (props) => (
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
                    <Field
                        name='securityCode'
                        component={Search}
                        type='text'
                        props={{
                            validateStatus: props.identityGenerationError ? 'error' : null,
                            help: props.identityGenerationError ? props.identityGenerationError.message : null,
                            onSearch: () => props.generateIdentity(props.hostnameValue, props.securityCodeValue),
                            ...fieldProps.securityCode,
                        }}
                    />
                </div>
                {props.identityGenerationInProgress &&
                    <div className='auth__status'>
                        <Spinner spinning />
                        <span className='status-text'>Generating identity...</span>
                    </div>
                }
            </div>
            <div className='auth__input'>
                <div>
                    <Field
                        name='identity'
                        validate={required}
                        component={Input}
                        type='text'
                        props={fieldProps.identity}
                    />
                </div>
                <div>
                    <Field
                        name='psk'
                        validate={required}
                        component={Input}
                        type='text'
                        props={fieldProps.psk}
                    />
                </div>
            </div>
        </div>
        <div className='form-section__button-row'>
            <div>
                <Button
                    onClick={props.previousStep}
                >
                    Previous
                </Button>
            </div>
            <div>
                <Button
                    type='primary'
                    onClick={props.nextStep}
                    disabled={!R.isEmpty(props.validationErrors)}
                >
                    Next
                </Button>
            </div>
        </div>
    </div>
)

const TestConnectionStep: React.FC<AllProps> = (props) => (
    <div>
        <div className='form-section__content'>
            <div>
                <p>
                    Finished! Now finish by trying to connect to the gateway. Clicking finish will save the gateway information.
                </p>
            </div>
            <div className='test__content'>
                <div>
                    <Button
                        type='primary'
                        onClick={() => props.testConnection(props.hostnameValue, props.identityValue, props.pskValue)}
                    >
                        Test connection
                    </Button>
                </div>
                {props.connectionTestInProgress &&
                    <div>
                        <Spinner spinning />
                        <span className='status-text'>Connecting to gateway...</span>
                    </div>
                }
                {props.connectionTestResult &&
                    <div>
                        {props.connectionTestResult.success ?
                            <span className='test__status--success'>Successfully connected to gateway!</span>
                            : <span className='test__status--failure'>Failed to connect to gateway</span>
                        }
                    </div>
                }
            </div>
        </div>
        <div className='form-section__button-row'>
            <div>
                <Button
                    onClick={props.previousStep}
                >
                    Previous
                </Button>
            </div>
            <div>
                <Button
                    onClick={props.handleSubmit(props.saveGateway)}
                    type='primary'
                    htmlType='submit'
                    disabled={props.submitting || !R.path(['connectionTestResult', 'success'], props)}
                >
                    Finish
                </Button>
            </div>
        </div>
    </div>
)

const GatewayWizardForm: React.FunctionComponent<AllProps> = (props) => {
    const { handleSubmit, step } = props
    return (
        <form onSubmit={handleSubmit}>
            {step === 0 && <DiscoveryStep {...props} />}
            {step === 1 && <AuthenticationStep {...props} />}
            {step === 2 && <TestConnectionStep {...props} />}
        </form>
    )
}

export default GatewayWizardForm
