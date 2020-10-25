import React, { useState } from 'react'
import * as R from 'ramda'
import { Button } from 'antd'

import { ConnectionTestResponse } from '@tradfri-control-panel/shared'
import { fetchPostJson } from '@/utils'
import Spinner from '@/components/Spinner'

import './TestConnectionStep.css'

export const test = async (hostname: string, identity: string, psk: string) => {
    const res = await fetchPostJson<ConnectionTestResponse>('/api/gateway/test', { hostname, identity, psk })

    if (!res.ok) throw new Error(R.path(['json', 'message'], res) || res.statusText)

    return res.json
}

interface TestConnectionStepProps {
    hostname: string
    identity: string
    psk: string
    previousStep: () => void
    nextStep: () => void
}

const TestConnectionStep: React.FC<TestConnectionStepProps> = (props) => {

    const { hostname, identity, psk, previousStep, nextStep } = props

    const [testingConnection, setTestingConnection] = useState(false)
    const [connectionTestResult, setConnectionTestResult] = useState<ConnectionTestResponse | null>(null)

    const testConnection = async () => {
        try {
            setTestingConnection(true)
            const result = await test(hostname, identity, psk)
            setConnectionTestResult(result)
        } catch (err) {

        } finally {
            setTestingConnection(false)
        }
    }

    return (
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
                            onClick={testConnection}
                            disabled={testingConnection}
                        >
                            Test connection
                    </Button>
                    </div>
                    {testingConnection &&
                        <div>
                            <Spinner spinning />
                            <span className='status-text'>Connecting to gateway...</span>
                        </div>
                    }
                    {connectionTestResult &&
                        <div>
                            {connectionTestResult.success ?
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
                        onClick={previousStep}
                        disabled={testingConnection}
                    >
                        Previous
                </Button>
                </div>
                <div>
                    <Button
                        onClick={nextStep}
                        type='primary'
                        disabled={testingConnection || !connectionTestResult || !!connectionTestResult.error}
                    >
                        Finish
                </Button>
                </div>
            </div>
        </div>
    )
}

export default TestConnectionStep
