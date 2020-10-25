import { Steps } from 'antd'
import React, { useState } from 'react'

import AuthenticationStep from './AuthenticationStep'
import DiscoveryStep from './DiscoveryStep'
import TestConnectionStep from './TestConnectionStep'

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

interface Values {
    name: string
    hostname: string
    identity: string
    psk: string
}

interface GatewayWizardProps {
    saveGateway: (value: Values) => void
}

const GatewayWizard: React.FC<GatewayWizardProps> = (props) => {

    const { saveGateway } = props

    const [scrollAnchor, setScrollAnchor] = useState<HTMLDivElement | null>(null)
    const [step, setStep] = useState(0)
    const [values, setValues] = useState<Values>({ name: '', hostname: '', identity: '', psk: '' })

    const { title } = steps[step]
    const { name, hostname, identity, psk } = values

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
                {step === 0 &&
                    <DiscoveryStep
                        initialValues={{ name, hostname }}
                        nextStep={(val) => {
                            setValues({ ...values, ...val })
                            nextStep()
                        }}
                    />
                }
                {step === 1 &&
                    <AuthenticationStep
                        initialValues={{ identity, psk }}
                        hostname={hostname}
                        previousStep={previousStep}
                        nextStep={(val) => {
                            setValues({ ...values, ...val })
                            nextStep()
                        }}
                    />
                }
                {step === 2 &&
                    <TestConnectionStep
                        hostname={hostname}
                        identity={identity}
                        psk={psk}
                        previousStep={previousStep}
                        nextStep={() => {
                            saveGateway(values)
                        }}
                    />
                }
            </div>
        </div>
    )
}

export default GatewayWizard
