import { Card, List, Slider, Switch } from 'antd'
import * as R from 'ramda'
import React from 'react'

import Brightness5Icon from 'mdi-react/Brightness5Icon'
import LightbulbOnOutlineIcon from 'mdi-react/LightbulbOnOutlineIcon'
import ThemeLightDarkIcon from 'mdi-react/ThemeLightDarkIcon'

import StatusIndicator, { Status } from '@/components/StatusIndicator'
import { Dictionary, CircadianSettings, Group, GroupUpdateRequest, Light } from '@tradfri-control-panel/shared'

import './LightGroups.css'
import { lightsForGroup, percentFormatter } from '@/utils'

const Item = List.Item

const anyLightIsOn = R.any<Light>(R.propOr(false, 'on'))
const lightBrightnesses = R.reduce<Light, number[]>((acc, light) => (!!light.brightness && acc.push(light.brightness), acc), [])
const avgBrightness = R.converge(R.divide, [R.pipe(lightBrightnesses, R.sum), R.length])

interface LightGroupsProps {
    groups: Dictionary<Group>
    lights: Dictionary<Light>
    initialDataLoading: boolean
    circadianSettings: CircadianSettings
    updateLight: (light: Light, sync: boolean) => void
    updateGroup: (groupUpdate: GroupUpdateRequest) => void
    enableCircadian: (groupId: string) => void
    disableCircadian: (groupId: string) => void
}

const LightGroups: React.FC<LightGroupsProps> = (props) => {

    const { groups, lights, circadianSettings, updateGroup, updateLight, enableCircadian, disableCircadian } = props

    const isCircadianEnabled = (group: Group) =>
        circadianSettings.groupIds.includes(String(group.id))

    const areCircadianSettingsValid = () => {
        const { latitude, longitude } = circadianSettings
        return !R.isEmpty(latitude) && !R.isEmpty(longitude)
    }

    const powerSwitched = ({ id }: Group, groupLights: Light[]) => (on: boolean) => {
        updateGroup({ id, on })
        for (const light of groupLights) {
            updateLight({ ...light, on }, false)
        }
    }

    const brightnessChanged = (groupLights: Light[]) => (brightness: number) => {
        for (const light of groupLights) {
            updateLight({ ...light, brightness }, false)
        }
    }

    return (
        <>
            {R.values(groups).map((group, idx) => {
                const groupLights = lightsForGroup(group, lights)
                if (group.default && !groupLights.length) return
                return (
                    <Card key={idx} className='light-group__card' title={group.name}>
                        <table className='light-group__table'>
                            <tbody>
                                <tr>
                                    <td><LightbulbOnOutlineIcon size={18} /></td>
                                    <td><span>Power</span></td>
                                    <td>
                                        <Switch
                                            disabled={!groupLights.length}
                                            checked={anyLightIsOn(groupLights)}
                                            size='small'
                                            onChange={powerSwitched(group, groupLights)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td><ThemeLightDarkIcon size={18} /></td>
                                    <td><span>Circadian</span></td>
                                    <td>
                                        <Switch
                                            disabled={!groupLights.length || !areCircadianSettingsValid()}
                                            checked={isCircadianEnabled(group)}
                                            size='small'
                                            onChange={
                                                (newValue) => newValue ?
                                                    enableCircadian(String(group.id)) :
                                                    disableCircadian(String(group.id))
                                            }
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td><Brightness5Icon size={18} /></td>
                                    <td><span>Brightness</span></td>
                                    <td>
                                        <Slider
                                            disabled={!groupLights.length}
                                            value={groupLights.length && avgBrightness(groupLights)}
                                            min={1}
                                            max={100}
                                            onChange={brightnessChanged(groupLights)}
                                            onAfterChange={(newValue: number) =>
                                                updateGroup({ id: group.id, brightness: newValue })}
                                            tipFormatter={percentFormatter}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='light-group__lights-header'>Lights</div>
                        <List
                            dataSource={groupLights}
                            renderItem={(light) => (
                                <Item>
                                    <StatusIndicator title={statusTitle(light)} status={status(light)} />{light.name}
                                </Item>
                            )}
                            bordered={true}
                            size='small'
                            locale={{ emptyText: 'No lights' }}
                        />
                    </Card>
                )
            })}
        </>
    )
}

const statusTitle = R.cond<Light, string>([
    [R.propEq('alive', true), R.always('Light is connected')],
    [R.T, R.always('Light is disconnected')]
])

const status = R.cond<Light, Status>([
    [R.propEq('alive', true), R.always('online')],
    [R.T, R.always('offline')]
])

export default LightGroups
