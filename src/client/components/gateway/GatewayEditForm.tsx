
import React from 'react'
import { Field, InjectedFormProps } from 'redux-form'

import { Input } from '@/components/form'
import { required } from '@/validators'

export interface IGatewayEditFormValues {
    name: string
    hostname: string
}

type AllProps = InjectedFormProps<IGatewayEditFormValues>

const fieldProps = {
    hostname: {
        colon: false,
        label: 'Gateway address',
    },
    name: {
        colon: false,
        label: 'Gateway name',
    }
}

const GatewayEditForm: React.FunctionComponent<AllProps> = (props) => {
    const { handleSubmit } = props
    return (
        <form onSubmit={handleSubmit}>
            <div className='discovery__input'>
                <div>
                    <Field
                        name='name'
                        validate={required}
                        component={Input as any}
                        type='text'
                        props={fieldProps.name as any}
                    />
                </div>
                <div>
                    <Field
                        name='hostname'
                        validate={required}
                        component={Input as any}
                        type='text'
                        props={fieldProps.hostname as any}
                    />
                </div>
            </div>
        </form>
    )
}

export default GatewayEditForm
