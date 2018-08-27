import React from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'

const FormItem = Form.Item

const InputField = ({ input, label, colon }) =>
    <FormItem
        label={label}
        colon={colon}>
        <Input value={input.value} />
    </FormItem>

InputField.propTypes = {
    input: PropTypes.object.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    colon: PropTypes.bool,
    disabled: PropTypes.bool
}

export {
    InputField as Input
}
