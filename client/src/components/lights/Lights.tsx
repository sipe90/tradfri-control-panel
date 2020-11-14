import { Card, List } from 'antd'
import * as R from 'ramda'
import React from 'react'

import LightItem from '#/components/lights/LightItem'
import Spinner from '#/components/Spinner'
import { lightsForGroup } from '#/utils'
import { Dictionary, CircadianSettings, Group, Light } from 'shared'

import './Lights.css'

interface LightsProps {
    groups: Dictionary<Group>
    lights: Dictionary<Light>
    circadianSettings: CircadianSettings
    initialDataLoading: boolean
    updateLight: (light: Light, sync: boolean) => void
}

const Lights: React.FC<LightsProps> = (props) => {

    const { initialDataLoading, groups, lights, circadianSettings, updateLight } = props

    const circadianEnabled = (group: Group) =>
        R.includes(String(group.id), circadianSettings.groupIds)


    return (
        <>
            {R.values(groups).map((group, idx) => {
                const groupLights = lightsForGroup(group, lights)

                if (group.default && !groupLights.length) return

                return (
                    <Card key={idx} className='lights-tab__card' title={group.name}>
                        <Spinner spinning={initialDataLoading}>
                            <List
                                itemLayout='vertical'
                                dataSource={groupLights}
                                renderItem={(light) => (
                                    <LightItem
                                        key={light.id}
                                        light={light}
                                        circadianEnabled={circadianEnabled(group)}
                                        updateLight={updateLight}
                                    />
                                )}
                                locale={{ emptyText: 'No lights' }}
                            />
                        </Spinner>
                    </Card>
                )
            })}
        </>
    )
}

export default Lights
