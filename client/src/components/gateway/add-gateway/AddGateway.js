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
        return <div>
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
            <div style={{ marginBottom: 16 }}>
                You can try to discover your trådfri gateway by clicking the discovery button or input the values manually yourself. You can freely rename the gateway.
            </div>
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'inline-block' }}>
                    <GatewayForm step={0} />
                </div>
                <div style={{ display: 'inline-block' }}>
                    <Button type='primary' >Discover</Button>
                </div>
            </div>
            <div>
                <Button type="primary" onClick={() => this.nextStep()}>Next</Button>
            </div>
        </div>
    }

    renderAuthenticationStep() {
        return <div>
            <div style={{ marginBottom: 16 }}>
                <GatewayForm step={1} />
            </div>
            <div>
                <Button type="primary" onClick={() => this.nextStep()}>Next</Button>
                <Button style={{ marginLeft: 8 }} onClick={() => this.previousStep()}>Previous</Button>
            </div>
        </div>
    }

    renderTestStep() {
        return <div>
            <div style={{ marginBottom: 16 }}>
                <GatewayForm step={2} />
            </div>
            <div>
                <Button style={{ marginLeft: 8 }} onClick={() => this.previousStep()}>Previous</Button>
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
