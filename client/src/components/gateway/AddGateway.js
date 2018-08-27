import React, { Component } from 'react'
import { Button, Steps } from 'antd'

import GatewayFormContainer from 'containers/modules/GatewayFormContainer'

const { Step } = Steps

const initialState = {
    step: 0
}

const steps = [{
    stepName: 'Discover',
    title: 'Discover a gateway on your local network',
    navigation: function () { return this.discoveryNavigation() }
}, {
    stepName: 'Authenticate',
    title: 'Generate authentication credentials',
    navigation: function () { return this.authenticationNavigation() }
}, {
    stepName: 'Test connection',
    title: 'Test gateway connection',
    navigation: function () { return this.testNavigation() }
}]

class AddGateway extends Component {

    constructor(props) {
        super(props)
        this.state = initialState
    }

    render() {
        const { title, navigation } = steps[this.state.step]
        return <div style={{ width: 720, padding: 24 }}>
            <div style={{ marginBottom: 24 }}>
                <Steps current={this.state.step}>
                    {steps.map(({ stepName }, idx) => <Step key={idx} title={stepName} />)}
                </Steps>
            </div>
            <div style={{ marginBottom: 16, color: 'rgba(0, 0, 0, 0.85)', fontWeight: 500 }}>
                {title}
            </div>
            <div style={{ height: 340 }}>
                <GatewayFormContainer step={this.state.step} />
            </div>
            {navigation.call(this)}
        </div>
    }

    discoveryNavigation() {
        return <div style={{ textAlign: 'right', padding: '10px 16px' }}>
            <Button type="primary" onClick={() => this.nextStep()}>Next</Button>
        </div>
    }

    authenticationNavigation() {
        return <div style={{ textAlign: 'right', padding: '10px 16px' }}>
            <Button onClick={() => this.previousStep()}>Previous</Button>
            <Button style={{ marginLeft: 8 }} type="primary" onClick={() => this.nextStep()}>Next</Button>
        </div>

    }

    testNavigation() {
        return <div style={{ textAlign: 'right', padding: '10px 16px' }}>
            <Button onClick={() => this.previousStep()}>Previous</Button>
            <Button style={{ marginLeft: 8 }} type="primary" onClick={() => undefined}>Finish</Button>
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
