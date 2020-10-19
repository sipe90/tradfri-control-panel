import CircadianSettingsFormContainer from '@/containers/settings/CircadianSettingsFormContainer'
import { Button, Card } from 'antd'
import React from 'react'
import { FormAction } from 'redux-form'

import { ICircadianSettingsFormValues } from './CircadianSettingsForm'

import './Circadian.css'

interface CircadianProps {
    updateCircadianSettings: (settings: ICircadianSettingsFormValues) => Promise<void>
    submitCircadianSettingsForm: () => FormAction
}

const Circadian: React.FC<CircadianProps> = (props) => {

    const { submitCircadianSettingsForm, updateCircadianSettings } = props

    return (
        <Card>
            <div style={{ textAlign: 'left' }}>
                {description}
            </div>
            <CircadianSettingsFormContainer
                onSubmit={updateCircadianSettings}
            />
            <div style={{ float: 'right' }}>
                <Button
                    type='primary'
                    onClick={submitCircadianSettingsForm}
                >
                    Save
                    </Button>
            </div>
        </Card>
    )
}

const description = (
    <>
        <div style={{ fontWeight: 'bold', marginBottom: 12 }}>Description</div>
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

export default Circadian
