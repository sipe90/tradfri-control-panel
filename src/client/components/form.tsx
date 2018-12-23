import React from 'react'
import { Form, Input } from 'antd'
import { WrappedFieldProps } from 'redux-form';
import { FormItemProps } from 'antd/lib/form';

const FormItem = Form.Item

const { Search } = Input

type FieldProps = WrappedFieldProps & FormItemProps

const InputField: React.FunctionComponent<FieldProps> = (props) => Field(props, Input)

const SearchField: React.FunctionComponent<FieldProps> = (props) => Field(props, Search)

const Field = ({ label, colon, hasFeedback, validateStatus, help, input, meta: { touched, error, warning }, ...rest }: FieldProps, FieldComponent: any) =>
    <FormItem
        label={label}
        colon={colon}
        hasFeedback={hasFeedback}
        validateStatus={(touched && error) ? 'error' : (touched && warning) ? 'warning' : validateStatus}
        help={(touched && error) ? error : (touched && warning) ? warning : help}>
        <FieldComponent value={input.value} onChange={input.onChange} onBlur={input.onBlur} {...rest} />
    </FormItem>

export {
    InputField as Input,
    SearchField as Search
}
