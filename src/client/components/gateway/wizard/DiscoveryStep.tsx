import React, { useState } from 'react'
import * as R from 'ramda'
import { DiscoveredGateway } from 'node-tradfri-client'
import { Button, Form, Input, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'

import Spinner from '@/components/Spinner'
import { fetchGetJson } from '@/utils'

import './DiscoveryStep.css'

const discover = async () => {
    const res = await fetchGetJson<DiscoveredGateway>('api/gateway/discover')

    if (res.status === 404) {
        return null
    }

    if (!res.ok) throw new Error(R.path(['json', 'message'], res) || res.statusText)

    return res.json
}

const columns: Array<ColumnProps<DiscoveredGateway>> = [{
    dataIndex: 'name',
    title: 'Name',
}, {
    dataIndex: 'host',
    title: 'Host',
}, {
    dataIndex: 'addresses',
    render: function renderAddresses([ipv4, ipv6]: [string, string]) { return <span>{ipv4}<br />{ipv6}</span> },
    title: 'Addresses',
}, {
    dataIndex: 'version',
    title: 'Version',
}]

interface FormValues {
    name: string
    hostname: string
}

interface DiscoveryStepProps {
    initialValues: Partial<FormValues>
    nextStep: (values: FormValues) => void
}

const DiscoveryStep: React.FC<DiscoveryStepProps> = (props) => {

    const { initialValues, nextStep } = props

    const [form] = Form.useForm()

    const [discovering, setDiscovering] = useState(false)
    const [discoveredGateway, setDiscoveredGateway] = useState<DiscoveredGateway | null>(null)

    const discoverGateway = async () => {
        try {
            setDiscovering(true)
            const result = await discover()
            setDiscoveredGateway(result)
            if (result) {
                const { name, addresses } = result
                form.setFieldsValue({
                    name,
                    hostname: addresses[0]
                })
            }
        } catch (err) {

        } finally {
            setDiscovering(false)
        }
    }

    return (
        <div>
            <div className='form-section__content'>
                <div>
                    <p>
                        You can try to discover your trådfri gateway by clicking the discovery button or input the gateway address manually yourself.
                        You can freely rename the gateway if you wish.
                    </p>
                </div>
                <div className='discovery__discover'>
                    <div>
                        <Button
                            type='primary'
                            onClick={discoverGateway}
                            disabled={discovering}
                        >
                            Discover
                    </Button>
                    </div>
                    {discovering &&
                        <div className='discovery__status'>
                            <Spinner spinning />
                            <span className='status-text'>Looking for a gateway...</span>
                        </div>
                    }
                </div>
                {discoveredGateway &&
                    <div>
                        <div className='discovery__table-header'>Discovered gateway</div>
                        <Table
                            size='small'
                            columns={columns}
                            dataSource={discoveredGateway ? [discoveredGateway] : []}
                            pagination={false}
                            rowKey='name'
                        />
                    </div>
                }
                <div className='discovery__input'>
                    <Form<FormValues>
                        form={form}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        initialValues={initialValues}
                        onFinish={nextStep}
                    >
                        <Form.Item
                            name='name'
                            label='Gateway name'
                            rules={[{ required: true, message: 'Name is required' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name='hostname'
                            label='Gateway address'
                            rules={[{ required: true, message: 'Address is required' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <div className='form-section__button-row'>
                <div>
                    <Button
                        type='primary'
                        onClick={form.submit}
                    >
                        Next
                </Button>
                </div>
            </div>
        </div>
    )
}

export default DiscoveryStep
