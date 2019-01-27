import { Form, Input, InputNumber } from 'antd'
import { FormItemProps } from 'antd/lib/form'
import { InputProps, SearchProps } from 'antd/lib/input'
import { InputNumberProps } from 'antd/lib/input-number'
import React from 'react'
import { WrappedFieldProps } from 'redux-form'

const FormItem = Form.Item

const { Search } = Input

type FieldProps<T> = WrappedFieldProps & FormItemProps & T

const InputField: React.FunctionComponent<FieldProps<InputProps>> = (props) => Field(props, Input)

const NumberInputField: React.FunctionComponent<FieldProps<InputNumberProps>> = (props) => Field(props, InputNumber)

const SearchField: React.FunctionComponent<FieldProps<SearchProps>> = (props) => Field(props, Search)

const Field = ({
               label, colon, hasFeedback, validateStatus, help, input,
               meta: { touched, error, warning }, ...rest
            }: FieldProps<any>,
               FieldComponent: React.ComponentClass<any>,
    ) => (
    <FormItem
        label={label}
        colon={colon}
        hasFeedback={hasFeedback}
        validateStatus={(touched && error) ? 'error' : (touched && warning) ? 'warning' : validateStatus}
        help={(touched && error) ? error : (touched && warning) ? warning : help}
    >
        <FieldComponent value={input.value} onChange={input.onChange} onBlur={input.onBlur} {...rest} />
    </FormItem>
)

export {
    InputField as Input,
    SearchField as Search,
    NumberInputField as NumberInput
}
