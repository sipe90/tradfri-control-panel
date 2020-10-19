import { Card, List } from 'antd'
import * as R from 'ramda'
import React from 'react'

import LightItem from '@/components/lights/LightItem'
import Spinner from '@/components/Spinner'
import { lightsForGroup } from '@/utils'
import { Dictionary, ICircadianSettings, IGroup, ILight } from 'shared/types'

import './Lights.css'

interface LightsProps {
    groups: Dictionary<IGroup>
    lights: Dictionary<ILight>
    circadianSettings: ICircadianSettings
    initialDataLoading: boolean
    updateLight: (light: ILight, sync: boolean) => void
}

const Lights: React.FC<LightsProps> = (props) => {

    const { initialDataLoading, groups, lights, circadianSettings, updateLight } = props

    const circadianEnabled = (group: IGroup) =>
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
