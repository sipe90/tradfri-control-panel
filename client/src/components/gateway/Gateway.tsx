import * as R from 'ramda'
import React, { useState } from 'react'

import { Card, Divider, Dropdown, Menu, Modal, Descriptions, Form, Input } from 'antd'
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { GatewayConnectionState, Gateway } from 'shared'

import StatusIndicator, { Status } from '#/components/StatusIndicator'

import './Gateway.css'

const { Item } = Descriptions

interface GatewayProps {
    gateway: Gateway
    initialDataLoading: boolean
    saveGateway: (gateway: Gateway) => Promise<void>
    updateGateway: (gateway: Partial<Gateway>) => Promise<void>
    deleteGateway: () => Promise<void>
    rebootGateway: () => Promise<void>
    resetGateway: () => Promise<void>
}

const Gateway: React.FC<GatewayProps> = (props) => {

    const { gateway } = props

    const [editModalVisible, setEditModalVisible] = useState(false)

    const [form] = Form.useForm()

    return (
        <>
            <Card title={
                <>
                    <StatusIndicator
                        title={statusTitle(gateway.connectionState)}
                        status={status(gateway.connectionState)}
                    />
                    {props.gateway.name}
                </>
            } extra={
                <div className='gateway__actions'>
                    <a onClick={() => setEditModalVisible(true)}>Edit</a>
                    <Divider type='vertical' />
                    <a onClick={() => showDeleteConfirm(props.deleteGateway)}>Delete</a>
                    <Divider type='vertical' />
                    <Dropdown trigger={['click']} overlay={<Menu>
                        <Menu.Item>
                            <a onClick={() => showRebootConfirm(props.rebootGateway)}>Reboot gateway</a>
                        </Menu.Item>
                        <Menu.Item>
                            <a onClick={() => showResetConfirm(props.rebootGateway)} style={{ color: 'red' }}>Factory reset</a>
                        </Menu.Item>
                    </Menu>}>
                        <a>More <DownOutlined /></a>
                    </Dropdown>
                </div>
            }>
                <Descriptions size='small' column={1}>
                    <Item label='Connection status'>
                        {statusTitle(gateway.connectionState)}
                    </Item>
                    <Item label='Hostname'>
                        {gateway.hostname}
                    </Item>
                    <Item label='Firmware version'>
                        {gateway.version}
                    </Item>
                </Descriptions>
            </Card>
            <Modal
                title='Edit gateway information'
                visible={editModalVisible}
                onOk={form.submit}
                onCancel={() => setEditModalVisible(false)}
            >
                <Form
                    form={form}
                    initialValues={gateway}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={(values) => {
                        props.updateGateway(values)
                            .then(() => setEditModalVisible(false))
                    }}
                >
                    <Form.Item
                        name='name'
                        label='Gateway name'
                        required
                        rules={[{ required: true, message: 'Name is required' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name='hostname'
                        label='Gateway address'
                        required
                        rules={[{ required: true, message: 'Address is required' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

const showDeleteConfirm = (handleDelete: () => void) => {
    Modal.confirm({
        title: 'Delete gateway',
        content: 'Are you sure you want to delete the gateway?',
        maskClosable: true,
        onOk: handleDelete
    })
}

const showRebootConfirm = (handleReboot: () => void) => {
    Modal.confirm({
        title: 'Reboot gateway',
        content: 'Are you sure you want to reboot the gateway?',
        maskClosable: true,
        onOk: handleReboot
    })
}

const showResetConfirm = (handleReset: () => void) => {
    Modal.confirm({
        title: 'Reset gateway',
        content: 'Are you sure you want to reset the gateway? ' +
            ' This wipes everything from the gateway, including paired devices, groups and moods! ' +
            ' You will also have to generate new credentials to authenticate with the gateway.',
        maskClosable: true,
        icon: <ExclamationCircleOutlined />,
        onOk: handleReset
    })
}

const statusTitle = R.cond<number, string>([
    [R.equals(GatewayConnectionState.CONNECTED), R.always('Connected to gateway')],
    [R.equals(GatewayConnectionState.DISCONNECTED), R.always('Gateway connection lost')],
    [R.equals(GatewayConnectionState.OFFLINE), R.always('Gateway is offline')],
    [R.T, R.always('Gateway is offline')]
])

const status = R.cond<number, Status>([
    [R.equals(GatewayConnectionState.CONNECTED), R.always('online')],
    [R.equals(GatewayConnectionState.DISCONNECTED), R.always('disconnected')],
    [R.T, R.always('offline')]
])

export default Gateway
