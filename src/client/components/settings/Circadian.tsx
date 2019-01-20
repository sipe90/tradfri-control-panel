import { Button, Card, List, Switch } from 'antd'
import React, { Component } from 'react'
import { IGroup } from 'shared/types'

import './Circadian.css'

const { Item } = List

class Circadian extends Component {
    public render = () => {
        return (
            <Card >
                <div style={{ textAlign: 'left' }}>
                    {description}
                </div>
                <div className='circadian__settings'>
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
)

const renderGroup = (name: string) => (
    <Item>
        {name}
    </Item>
)

export default Circadian
