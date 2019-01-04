import * as R from 'ramda'
import React from 'react'

import { Card, Divider, Dropdown, Icon, Menu, Modal } from 'antd'

import { GatewayConnectionState, IGateway } from 'shared/types'

import StatusIndicator from '@/components/StatusIndicator'
import GatewayEditFormContainer from '@/containers/gateway/GatewayEditFormContainer'

import './Gateway.css'

interface IGatewayProps {
    gateway: IGateway
    initialDataLoading: boolean
    dispatchGatewayStateChanged: (gateway: IGateway) => void
    dispatchSaveGateway: (gateway: IGateway) => void
    dispatchUpdateGateway: (gateway: Partial<IGateway>) => void
    dispatchSubmitEditGatewayForm: () => void
}

interface IGatewayState {
    editModalVisible: boolean
}

const initialState = {
    editModalVisible: false,
}

class Gateway extends React.Component<IGatewayProps, IGatewayState> {

    constructor(props: Readonly<IGatewayProps>) {
        super(props)
        this.state = initialState
    }

    public render = () => (
        <>
            <Card title={this.title()} extra={this.actionButtons()}>
                {this.gatewayDetails()}
            </Card>
            <Modal
                title='Edit gateway information'
                visible={this.state.editModalVisible}
                onOk={this.props.dispatchSubmitEditGatewayForm}
                onCancel={() => this.setEditModalVisible(false)}
            >
                <GatewayEditFormContainer onSubmit={this.handleSubmit} />
            </Modal>
        </>
    )

    private title = () => (
        <>
            <StatusIndicator title={statusTitle(this.props.gateway)} status={status(this.props.gateway)}/>
            {this.props.gateway.name}
        </>
    )

    private actionButtons = () => (
        <div className='gateway__actions'>
            <a onClick={() => this.setEditModalVisible(true)}>Edit</a>
            <Divider type='vertical' />
            <a>Delete</a>
            <Divider type='vertical' />
            <Dropdown trigger={['click', 'hover']} overlay={this.dropdown()}>
                <a>More <Icon type='down' /></a>
            </Dropdown>
        </div>
    )

    private dropdown = () => (
        <Menu>
          <Menu.Item>
            <a>Reboot gateway</a>
          </Menu.Item>
          <Menu.Item>
            <a>Factory reset</a>
          </Menu.Item>
        </Menu>
      )

    private gatewayDetails = () => {
        const gateway = this.props.gateway
        return (
            <table className='gateway__table'>
                <tbody>
                    <tr>
                        <td>
                            Connection status
                        </td>
                        <td>
                            {statusTitle(gateway)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Hostname
                        </td>
                        <td>
                            {gateway.hostname}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Firmware version
                        </td>
                        <td>
                            {gateway.version}
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }

    private setEditModalVisible = (visible: boolean) => this.setState({ editModalVisible: visible })

    private handleSubmit = (gateway: Partial<IGateway>) => {
        const newGatewayState = { ...this.props.gateway, ...gateway }
        this.props.dispatchUpdateGateway(gateway)
        this.props.dispatchGatewayStateChanged(newGatewayState)
        this.setEditModalVisible(false)
    }
}

const statusTitle = R.cond([
    [R.propEq('connectionState', GatewayConnectionState.CONNECTED), R.always('Connected to gateway')],
    [R.propEq('connectionState', GatewayConnectionState.DISCONNECTED), R.always('Gateway connection lost')],
    [R.propEq('connectionState', GatewayConnectionState.OFFLINE), R.always('Gateway is offline')],
    [R.T, R.always('Gateway is offline')]
])

const status = R.cond([
    [R.propEq('connectionState', GatewayConnectionState.CONNECTED), R.always('online')],
    [R.propEq('connectionState', GatewayConnectionState.DISCONNECTED), R.always('disconnected')],
    [R.T, R.always('offline')]
])

export default Gateway
