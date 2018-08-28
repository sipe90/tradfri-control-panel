import React, { Component } from 'react'
import { Steps } from 'antd'

import GatewayFormContainer from 'containers/modules/GatewayFormContainer'

const { Step } = Steps

const initialState = {
    step: 0
}

const steps = [{
    stepName: 'Discover',
    title: 'Discover a gateway on your local network'
}, {
    stepName: 'Authenticate',
    title: 'Generate authentication credentials'
}, {
    stepName: 'Test connection',
    title: 'Test gateway connection'
}]

class AddGateway extends Component {

    constructor(props) {
        super(props)
        this.state = initialState
    }

    render() {
        const { title } = steps[this.state.step]
        return <div style={{ width: 720, padding: 24 }}>
            <div style={{ marginBottom: 24 }}>
                <Steps current={this.state.step}>
                    {steps.map(({ stepName }, idx) => <Step key={idx} title={stepName} />)}
                </Steps>
            </div>
            <div style={{ marginBottom: 16, color: 'rgba(0, 0, 0, 0.85)', fontWeight: 500 }}>
                {title}
            </div>
            <div>
                <GatewayFormContainer
                    step={this.state.step}
                    nextStep={() => this.nextStep()}
                    previousStep={() => this.previousStep()} />
            </div>
        </div>
    }

    nextStep() {
        this.setState({ step: Math.min(this.state.step + 1, 2) })
    }

    previousStep() {
        this.setState({ step: Math.max(this.state.step - 1, 0) })
    }
}

export default AddGateway
