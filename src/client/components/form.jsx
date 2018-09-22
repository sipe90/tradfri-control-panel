import React from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'

const FormItem = Form.Item

const { Search } = Input

const InputField = (props) => Field(props, Input)

const SearchField = (props) => Field(props, Search)

const Field = ({ label, colon, hasFeedback, validateStatus, help, input, meta: { touched, error, warning }, ...rest }, FieldComponent) =>
    <FormItem
        label={label}
        colon={colon}
        hasFeedback={hasFeedback}
        validateStatus={(touched && error) ? 'error' : (touched && warning) ? 'warning' : validateStatus}
        help={(touched && error) ? error : (touched && warning) ? warning : help}>
        <FieldComponent value={input.value} onChange={input.onChange} onBlur={input.onBlur} {...rest} />
    </FormItem>


Field.propTypes = {
    input: PropTypes.object.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    colon: PropTypes.bool,
    disabled: PropTypes.bool,
    hasFeedback: PropTypes.bool,
    validateStatus: PropTypes.string,
    help: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    meta: PropTypes.shape({
        touched: PropTypes.bool.isRequired,
        error: PropTypes.string,
        warning: PropTypes.string
    })
}

export {
    InputField as Input,
    SearchField as Search
}
