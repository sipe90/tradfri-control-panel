import { NumberInput } from '@/components/form'
import { required } from '@/validators'
import { List, Switch } from 'antd'
import React from 'react'
import { Field, InjectedFormProps } from 'redux-form'

import './CircadianSettingsForm.css'

const { Item } = List

export interface ICircadianSettingsFormValues {
    enabled: boolean
    latitude: string
    longitude: string
    groupIds: string[]
}

type AllProps = InjectedFormProps<ICircadianSettingsFormValues>

const fieldProps = {
    enabled: {
    },
    latitude: {
        colon: false,
        label: 'Latitude',
        max: 90,
        min: -90,
        precision: 6
    },
    longitude: {
        colon: false,
        label: 'Longitude',
        align: 'vertical',
        max: 180,
        min: -180,
        precision: 6
    },
    groupIds: {
    }
}

const CircadianSettingsForm: React.FunctionComponent<AllProps> = (props) => {
    const { handleSubmit } = props
    return (
        <form onSubmit={handleSubmit}>
            <div className='circadian__settings'>
                <div>
                    Status
                </div>
                <div>
                    Enabled <Switch />
                </div>
                <div>
                    Location
                </div>
                <div style={{ display: 'flex'}}>
                    <div style={{ marginRight: 24 }}>
                        <Field
                            name='latitude'
                            type='text'
                            validate={required}
                            component={NumberInput as any}
                            props={fieldProps.latitude as any}
                        />
                    </div>
                    <div>
                        <Field
                            name='longitude'
                            type='text'
                            validate={required}
                            component={NumberInput as any}
                            props={fieldProps.longitude as any}
                        />
                    </div>
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
        </form>
    )
}

const renderGroup = (name: string) => (
    <Item>
        {name}
    </Item>
)

export default CircadianSettingsForm
