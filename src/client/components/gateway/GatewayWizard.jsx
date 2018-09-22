import React, { Component } from 'react'
import { Steps } from 'antd'

import GatewayFormContainer from 'containers/modules/GatewayFormContainer'

import 'components/gateway/GatewayWizard.css'

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

class GatewayWizard extends Component {

    constructor(props) {
        super(props)
        this.state = initialState
    }

    render() {
        const { title } = steps[this.state.step]
        return <div className='gateway-wizard' ref={(e) => this.scrollAnchor = e} >
            <div className='gateway-wizard__steps'>
                <Steps size='small' current={this.state.step}>
                    {steps.map(({ stepName }, idx) => <Step key={idx} title={stepName} />)}
                </Steps>
            </div>
            <div className='gateway-wizard__title'>
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
        this.scrollAnchor.scrollIntoView(true)
    }

    previousStep() {
        this.setState({ step: Math.max(this.state.step - 1, 0) })
        this.scrollAnchor.scrollIntoView(true)
    }
}

export default GatewayWizard
