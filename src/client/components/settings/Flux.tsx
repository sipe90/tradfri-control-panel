import { Button, Card, List, Switch } from 'antd'
import React, { Component } from 'react'
import { IGroup } from 'shared/types'

import './Flux.css'

const { Item } = List

class Flux extends Component {
    public render = () => {
        return (
            <Card >
                <div style={{ textAlign: 'left' }}>
                    {description}
                </div>
                <div className='flux__settings'>
                    <div>
                        Status
                    </div>
                    <div>
                        Enabled <Switch /> <Button type='primary'>Set up</Button>
                    </div>
                    <div>
                        Location
                    </div>
                    <div>
                        12.578 Lat -21.354 Lon
                    </div>
                    <div>
                        Groups
                    </div>
                    <div>
                        <List
                            dataSource={['Group1', 'Group2']}
                            renderItem={renderGroup}
                            bordered={true}
                            size='small'
                            locale={{ emptyText: 'No groups'}}
                        />
                    </div>
                </div>
            </Card>
        )
    }
}

const description = (
    <>
        <p>
            {
                'Flux is an automated system designed to control the color temperature ' +
                'of smart lamps according to the time of day.'
            }
        </p>
        <p>
            {
                'In the morning it lowers the color temperature to match the bright morning sunlight. ' +
                'And when the sun sets, the temperature is adjusted to a warmer color.'
            }
        </p>
        <p>
            {'This feature could be called '}
            <a target='_blank' href='https://justgetflux.com/'>f.lux</a>
            {' for smart lighting.'}
        </p>
    </>
)

const renderGroup = (name: string) => (
    <Item>
        {name}
    </Item>
)

export default Flux
