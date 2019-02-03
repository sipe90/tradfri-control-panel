import { NumberInput } from '@/components/form'
import { required } from '@/validators'
import React from 'react'
import { Field, InjectedFormProps } from 'redux-form'

import { List } from 'antd'
import { IGroup } from 'shared/types'
import './CircadianSettingsForm.css'

const { Item } = List

export interface ICircadianSettingsFormValues {
    latitude: string
    longitude: string
}

export interface ICircadianSettingsFormProps {
    groups: IGroup[]
}

type AllProps = InjectedFormProps<ICircadianSettingsFormValues, ICircadianSettingsFormProps>
    & ICircadianSettingsFormProps

const fieldProps = {
    latitude: {
        colon: false,
        label: 'Latitude',
        max: 90,
        min: -90,
        precision: 3
    },
    longitude: {
        colon: false,
        label: 'Longitude',
        align: 'vertical',
        max: 180,
        min: -180,
        precision: 3
    }
}

const CircadianSettingsForm: React.FunctionComponent<AllProps> = (props) => {
    const { handleSubmit } = props
    return (
        <form onSubmit={handleSubmit}>
            <div className='circadian__settings'>
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
                        dataSource={props.groups}
                        renderItem={({name}: IGroup) => <Item>{name}</Item>}
                        bordered={true}
                        size='small'
                        locale={{ emptyText: 'No groups'}}
                    />
                </div>
            </div>
        </form>
    )
}

export default CircadianSettingsForm
