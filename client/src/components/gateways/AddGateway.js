import React, { Component } from 'react'
import { Steps } from 'antd'

const { Step } = Steps

const initialState = {
    step: 0
}

const renderDiscoveryStep = (props) => {
    return <div>

    </div>
}

const renderAuthenticationStep = (props) => {
    return <div>

    </div>
}

const renderTestStep = (props) => {
    return <div>

    </div>
}

const steps = [{
    stepName: 'Discover',
    title: 'Discover a gateway on your local network',
    content: renderDiscoveryStep
}, {
    stepName: 'Authentication',
    title: 'Generate authentication credentials',
    content: renderAuthenticationStep
}, {
    stepName: 'Test connection',
    title: 'Test gateway connection',
    content: renderTestStep
}]


class AddGateway extends Component {

    constructor(props) {
        super(props)
        this.state = initialState
    }

    render() {
        const currentStep = steps[this.state.step]
        return <div>
            <Steps current={this.state.step}>
                {steps.map(({ stepName }, idx) => <Step key={idx} title={stepName} />)}
            </Steps>
            <h4>{currentStep.title}</h4>
            {currentStep.content(this.props)}
        </div>
    }
}

export default AddGateway
