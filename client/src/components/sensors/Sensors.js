import React, { Component } from 'react'
import { Card, Spin, Icon } from 'antd'
import PropTypes from 'prop-types'
import * as R from 'ramda'

import SensorCard from 'components/sensors/SensorCard'

import 'components/sensors/Sensors.css'

class Sensors extends Component {

    componentDidMount() {
        this.props.loadSensors()
        this.props.startSensorPolling()
    }

    componentWillUnmount() {
        this.props.stopSensorPolling()
    }
    
    render() {
        return (
            <Spin spinning={this.props.initialDataLoading} style={{ marginTop: '240px'}} indicator={<Icon type='loading' style={{ fontSize: 24 }} spin />}>
                <div className='card-container'>
                    { !R.isEmpty(this.props.gateways) ? R.values(this.props.gateways).map((gateway, idx) =>
                        this.gatewayHasSensors(gateway) ?
                        <div className='gateway-card' key={idx}>
                            <Card title={gateway.name}>
                                {this.getSensorsForGateway(gateway).map((sensor, idx) =>
                                    <SensorCard 
                                        key={idx}
                                        sensor={sensor}
                                        nameEdit={this.props.nameEdit[sensor.id] || ''}
                                        nameEditChanged={this.props.nameEditChanged}
                                        updateSensor={this.props.updateSensor}/>
                                )}
                            </Card>
                        </div> : null)
                        : !this.props.dataLoading ? 'No sensors found' : null
                    }
                </div>
            </Spin>
        )
    }

    gatewayHasSensors({ id }) {
        return !R.isEmpty(this.props.gateways[id].sensors)
    }

    getSensorsForGateway({ id }) {
        return R.pipe(
            R.pickAll(this.props.gateways[id].sensors),
            R.values,
            R.filter(Boolean)
        )(this.props.sensors)
    }

}

Sensors.propTypes = {
    gateways: PropTypes.object.isRequired,
    sensors: PropTypes.object.isRequired,
    loadSensors: PropTypes.func.isRequired,
    initialDataLoading: PropTypes.bool.isRequired,
    nameEditChanged: PropTypes.func.isRequired,
    updateSensor: PropTypes.func.isRequired,
    startSensorPolling: PropTypes.func.isRequired,
    stopSensorPolling: PropTypes.func.isRequired
}

export default Sensors
