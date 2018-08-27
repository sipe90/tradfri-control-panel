import React, { Component } from 'react'
import { Button, Steps } from 'antd'

import GatewayForm from 'components/gateway/add-gateway/GatewayForm'

const { Step } = Steps

const initialState = {
    step: 0
}

const steps = [{
    stepName: 'Discover',
    title: 'Discover a gateway on your local network',
    content: function () { return this.renderDiscoveryStep() }
}, {
    stepName: 'Authenticate',
    title: 'Generate authentication credentials',
    content: function () { return this.renderAuthenticationStep() }
}, {
    stepName: 'Test connection',
    title: 'Test gateway connection',
    content: function () { return this.renderTestStep() }
}]


class AddGateway extends Component {

    constructor(props) {
        super(props)
        this.state = initialState
    }

    render() {
        const currentStep = steps[this.state.step]
        return <div style={{ width: 720, padding: 24 }}>
            <div style={{ marginBottom: 24 }}>
                <Steps current={this.state.step}>
                    {steps.map(({ stepName }, idx) => <Step key={idx} title={stepName} />)}
                </Steps>
            </div>
            <div style={{ marginBottom: 16, color: 'rgba(0, 0, 0, 0.85)', fontWeight: 500 }}>
                {currentStep.title}
            </div>
            {currentStep.content.call(this)}
        </div>
    }

    renderDiscoveryStep() {
        return <div>
            <div style={{ height: 340 }}>
                <div style={{ marginBottom: 16 }}>
                    <p>
                        You can try to discover your trådfri gateway by clicking the discovery button or input the gateway address manually yourself.
                        You can freely rename the gateway if you wish.
                    </p>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <Button type='primary' >Discover</Button>
                </div>
                <div>
                    <GatewayForm step={0} />
                </div>
            </div>
            <div style={{ textAlign: 'right', padding: '10px 16px' }}>
                <Button type="primary" onClick={() => this.nextStep()}>Next</Button>
            </div>
        </div>
    }

    renderAuthenticationStep() {
        return <div>
            <div style={{ height: 340 }}>
                <div style={{ marginBottom: 16 }}>
                    <p>
                        You will need to generate an identity to authenticate Trådfri Control Panel with your gateway.
                        You can generate an identity/psk pair by inputting the security code imprinted in the gateway and clicking the authenticate button.
                    </p>
                    <p>
                        If you already have a generated identity, you can input them directly.
                    </p>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <Button type='primary' >Authenticate</Button>
                </div>
                <div>
                    <GatewayForm step={1} />
                </div>
            </div>
            <div style={{ textAlign: 'right', padding: '10px 16px' }}>
                <Button onClick={() => this.previousStep()}>Previous</Button>
                <Button style={{ marginLeft: 8 }} type="primary" onClick={() => this.nextStep()}>Next</Button>
            </div>
        </div>
    }

    renderTestStep() {
        return <div>
            <div style={{ height: 340 }}>
                <div>
                    <GatewayForm step={2} />
                </div>
            </div>
            <div style={{ textAlign: 'right', padding: '10px 16px' }}>
                <Button onClick={() => this.previousStep()}>Previous</Button>
                <Button style={{ marginLeft: 8 }} type="primary" onClick={() => undefined}>Finish</Button>
            </div>
        </div>
    }

    nextStep() {
        this.setState({ step: this.state.step + 1 })
    }

    previousStep() {
        this.setState({ step: this.state.step - 1 })
    }
}

export default AddGateway
