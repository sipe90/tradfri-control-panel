import * as R from 'ramda'
import React from 'react'

import { Card, Divider, Dropdown, Icon, Menu } from 'antd'

import { GatewayConnectionState, IGateway } from 'shared/types'

import StatusIndicator from '../StatusIndicator'
import './Gateway.css'

interface IGatewayProps {
    gateway: IGateway
    initialDataLoading: boolean
    dispatchGatewayStateChanged: (gateway: IGateway) => void
    dispatchSaveGateway: (gateway: IGateway) => void
    dispatchUpdateGateway: (gateway: Partial<IGateway>) => void
}

interface IGatewayState {
    editNameVisible: boolean
    editNameText: string
}

const initialState = {
    editNameText: '',
    editNameVisible: false,
}

class Gateway extends React.Component<IGatewayProps, IGatewayState> {

    constructor(props: Readonly<IGatewayProps>) {
        super(props)
        this.state = initialState
    }

    public render = () => (
        <div>
            <Card title={this.title()} extra={this.actionButtons()}>
                {this.gatewayDetails()}
            </Card>
        </div>
    )

    private title = () => (
        <>
            <StatusIndicator title={statusTitle(this.props.gateway)} status={status(this.props.gateway)}/>
            {this.props.gateway.name}
        </>
    )

    private actionButtons = () => (
        <div className='gateway__actions'>
            <a>Edit</a>
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

    private updateName = () => {
        const newGatewayState = { ...this.props.gateway, name: this.state.editNameText }
        this.props.dispatchUpdateGateway(newGatewayState)
        this.props.dispatchGatewayStateChanged(newGatewayState)
        this.setState({ editNameVisible: false })
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
