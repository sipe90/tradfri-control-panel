import React, { useState } from 'react'
import * as R from 'ramda'
import { Button, Form, Input } from 'antd'
import { fetchPostJson } from '@/utils'

import './AuthenticationStep.css'

interface IGenerateIdentityResponse {
    identity: string
    psk: string
}

const generate = async (hostname: string, securityCode: string) => {
    const res = await fetchPostJson<IGenerateIdentityResponse>(
        'api/gateway/identity', { hostname, securityCode })

    if (!res.ok) throw new Error(R.path(['json', 'message'], res) || res.statusText)

    return res.json
}

type FormValues = IGenerateIdentityResponse

interface AuthenticationStepProps {
    hostname: string
    initialValues: Partial<FormValues>
    previousStep: () => void
    nextStep: (values: FormValues) => void
}

const AuthenticationStep: React.FC<AuthenticationStepProps> = (props) => {

    const { hostname, initialValues, nextStep, previousStep } = props

    const [idGenForm] = Form.useForm()
    const [authForm] = Form.useForm()

    const [generatingIdentity, setGeneratingIdentity] = useState(false)
    const [generationError, setGenerationError] = useState<string | null>(null)

    const generateIdentity = async (securityCode: string) => {
        try {
            setGeneratingIdentity(true)
            const result = await generate(hostname, securityCode)
            if (result) {
                setGenerationError(null)
                const { identity, psk } = result
                idGenForm.setFieldsValue({
                    identity,
                    psk
                })
            }
        } catch (err) {
            setGenerationError(err.message || 'Failed to generate identity')
        } finally {
            setGeneratingIdentity(false)
        }
    }

    return (
        <div>
            <div className='form-section__content'>
                <div>
                    <p>
                        You will need to generate an identity to authenticate Trådfri Control Panel with your gateway.
                        You can generate an identity/psk pair by inputting the security code imprinted in the gateway and clicking the Generate button.
                </p>
                    <p>
                        If you already have a generated identity, you can input them directly.
                </p>
                </div>
                <div className='auth__security-code'>
                    <div>
                        <Form
                            form={idGenForm}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                        >
                            <Form.Item
                                name='securityCode'
                                label='Security code'
                                validateStatus={generationError ? 'error' : ''}
                                help={generationError}
                            >
                                <Input.Search
                                    enterButton='Generate'
                                    disabled={generatingIdentity}
                                    loading={generatingIdentity}
                                    onSearch={generateIdentity}
                                />
                            </Form.Item>
                        </Form>
                    </div>
                </div>
                <div className='auth__input'>
                    <Form<FormValues>
                        form={authForm}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={initialValues}
                        onFinish={nextStep}
                    >
                        <Form.Item
                            name='identity'
                            label='Identity'
                            rules={[{ required: true, message: 'Identity is required' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name='psk'
                            label='Pre-shared key'
                            rules={[{ required: true, message: 'Pre-shared key is required' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <div className='form-section__button-row'>
                <div>
                    <Button
                        onClick={previousStep}
                        disabled={generatingIdentity}
                    >
                        Previous
                </Button>
                </div>
                <div>
                    <Button
                        type='primary'
                        onClick={authForm.submit}
                        disabled={generatingIdentity}
                    >
                        Next
                </Button>
                </div>
            </div>
        </div>
    )
}

export default AuthenticationStep
