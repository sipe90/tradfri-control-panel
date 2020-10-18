import { Steps } from 'antd'
import React, { useState } from 'react'

import GatewayWizardFormContainer from '@/containers/gateway/GatewayWizardFormContainer'

import './GatewayWizard.css'

const { Step } = Steps

const steps = [{
    stepName: 'Discover',
    title: 'Discover a gateway on your local network',
}, {
    stepName: 'Authenticate',
    title: 'Generate authentication credentials',
}, {
    stepName: 'Test connection',
    title: 'Test gateway connection',
}]

const GatewayWizard: React.FC = () => {

    const [scrollAnchor, setScrollAnchor] = useState<HTMLDivElement | null>(null)
    const [step, setStep] = useState(0)

    const { title } = steps[step]

    const nextStep = () => {
        setStep(Math.min(step + 1, 2))
        scrollAnchor && scrollAnchor.scrollIntoView(true)
    }

    const previousStep = () => {
        setStep(Math.max(step - 1, 0))
        scrollAnchor && scrollAnchor.scrollIntoView(true)
    }

    return (
        <div className='gateway-wizard' ref={setScrollAnchor} >
            <div className='gateway-wizard__steps'>
                <Steps size='small' current={step}>
                    {steps.map(({ stepName }, idx) => <Step key={idx} title={stepName} />)}
                </Steps>
            </div>
            <div className='gateway-wizard__title'>
                {title}
            </div>
            <div>
                <GatewayWizardFormContainer
                    step={step}
                    nextStep={nextStep}
                    previousStep={previousStep}
                />
            </div>
        </div>
    )
}

export default GatewayWizard
