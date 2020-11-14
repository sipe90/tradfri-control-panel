import { Button, Card, Form, InputNumber, List } from 'antd'
import React, { useEffect } from 'react'
import { CircadianSettings, Group } from 'shared'

import './Circadian.css'

interface FormValues {
    latitude: string
    longitude: string
}

interface CircadianProps {
    settings: CircadianSettings
    circadianGroups: Group[]
    saveSettings: (settings: FormValues) => Promise<void>
}

const Circadian: React.FC<CircadianProps> = (props) => {

    const { settings, circadianGroups, saveSettings } = props

    const [form] = Form.useForm()

    useEffect(() => form.resetFields(), [settings])

    const latitude = parseFloat(settings.latitude)
    const longitude = parseFloat(settings.longitude)

    return (
        <Card>
            <div style={{ textAlign: 'left' }}>
                <>
                    <div style={{ fontWeight: 'bold', marginBottom: 12 }}>Description</div>
                    <p>
                        {
                            'Circadian lighting is a type of lighting that changes it\'s the color temperature ' +
                            'according to the time of day.'
                        }
                    </p>
                    <p>
                        {
                            'In the morning it lowers the color temperature to match the bright morning sunlight. ' +
                            'And when the sun sets, the temperature is adjusted to a more warm color.'
                        }
                    </p>
                    <p>
                        {
                            'The point of this is to avoid blue light during late hours. Your circadian rhythm is affected by ' +
                            'the surrounding ambient lighting. Blue light signals us that it is daytime ' +
                            'and it can mess with your rhythm. By adjusting the lighting to be warmer at late hours ' +
                            'can help you sleep better.'
                        }
                    </p>
                </>
            </div>
            <div className='circadian__settings'>
                <div>
                    Location
                </div>
                <div style={{ height: 80 }}>
                    <Form<FormValues>
                        form={form}
                        initialValues={{ latitude, longitude }}
                        onFinish={saveSettings}
                        layout='inline'
                    >
                        <Form.Item
                            name='latitude'
                            label='Latitude'
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <InputNumber
                                max={90}
                                min={-90}
                                precision={3}
                            />
                        </Form.Item>
                        <Form.Item
                            name='longitude'
                            label='Longitude'
                            rules={[{ required: true, message: 'Required' }]}
                        >
                            <InputNumber
                                max={180}
                                min={-180}
                                precision={3}
                            />
                        </Form.Item>
                    </Form>
                </div>
                <div>
                    Groups
                </div>
                <div>
                    <List
                        dataSource={circadianGroups}
                        renderItem={({ name }) => <List.Item>{name}</List.Item>}
                        bordered={true}
                        size='small'
                        locale={{ emptyText: 'No groups' }}
                    />
                </div>
            </div>
            <div style={{ float: 'right' }}>
                <Button
                    type='primary'
                    onClick={form.submit}
                >
                    Save
                    </Button>
            </div>
        </Card>
    )
}

export default Circadian
