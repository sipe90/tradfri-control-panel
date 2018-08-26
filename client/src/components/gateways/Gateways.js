import React, { Component } from 'react'
import { Button, Spin, Icon, Modal } from 'antd'
import PropTypes from 'prop-types'
import * as R from 'ramda'

import GatewayCard from 'components/gateways/GatewayCard'
import AddGateway from 'components/gateways/AddGateway'

import 'components/gateways/Gateways.css'

const initialState = {
    addGatewayModalOpen: false
}

class Gateways extends Component {

    constructor(props) {
        super(props)
        this.state = initialState
    }

    componentDidMount() {
        this.props.loadGateways()
        this.props.startGatewayPolling()
    }

    componentWillUnmount() {
        this.props.stopGatewayPolling()
    }
    
    render() {
        return (
            <div>
                <div>
                    <Button type='primary' onClick={this.openAddGatewayModal.bind(this)}>Add gateway</Button>
                </div>
                <Spin spinning={this.props.initialDataLoading} style={{ marginTop: '240px'}} indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />}>
                    <div className='card-container'>
                        { !R.isEmpty(this.props.gateways) ? R.values(this.props.gateways).map((gateway, idx) =>
                            <GatewayCard 
                                key={idx}
                                gateway={gateway}
                                gatewayStateChanged={this.props.gatewayStateChanged}
                                updateGateway={this.props.updateGateway}/>
                        )
                            : !this.props.initialDataLoading ? 'No gateways found' : null }
                    </div>
                </Spin>
                <Modal
                    title='Add gateway'
                    visible={this.state.addGatewayModalOpen}
                    onOk={this.closeAddGatewayModal.bind(this)}
                    onCancel={this.closeAddGatewayModal.bind(this)}
                    width='1000px'>
                    <AddGateway/>
                </Modal>
            </div>
        )
    }

    openAddGatewayModal() {
        this.setState({ addGatewayModalOpen: true })
    }

    closeAddGatewayModal() {
        this.setState({ addGatewayModalOpen: false })
    }
}

Gateways.propTypes = {
    gateways: PropTypes.object.isRequired,
    loadGateways: PropTypes.func.isRequired,
    initialDataLoading: PropTypes.bool.isRequired,
    gatewayStateChanged: PropTypes.func.isRequired,
    updateGateway: PropTypes.func.isRequired,
    startGatewayPolling: PropTypes.func.isRequired,
    stopGatewayPolling: PropTypes.func.isRequired
}

export default Gateways
