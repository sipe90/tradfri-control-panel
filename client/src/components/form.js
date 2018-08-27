import React from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'

const FormItem = Form.Item

const { Search } = Input

const InputField = ({ label, colon, hasFeedback, validateStatus, help, input, ...rest }) =>
    <FormItem
        label={label}
        colon={colon}
        hasFeedback={hasFeedback}
        validateStatus={validateStatus}
        help={help}>
        <Input value={input.value} onChange={input.onChange} {...rest} />
    </FormItem>

const SearchField = ({ label, colon, hasFeedback, validateStatus, help, input, ...rest }) =>
    <FormItem
        label={label}
        colon={colon}
        hasFeedback={hasFeedback}
        validateStatus={validateStatus}
        help={help}>
        <Search value={input.value} onChange={input.onChange} {...rest} />
    </FormItem>

InputField.propTypes = {
    input: PropTypes.object.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    colon: PropTypes.bool,
    disabled: PropTypes.bool
}

export {
    InputField as Input,
    SearchField as Search
}
