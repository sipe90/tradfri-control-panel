import { Col, Input, InputNumber, Row } from 'antd'
import { InputProps, SearchProps } from 'antd/lib/input'
import { InputNumberProps } from 'antd/lib/input-number'
import React from 'react'
import { WrappedFieldProps } from 'redux-form'

const { Search } = Input

export type FieldProps<T> = {
    align: 'horizontal' | 'vertical'
    decorate?: IDecoratorProps
} & T

interface IDecoratorProps {
    colon?: boolean
    title?: React.ReactNode
}

type FieldComponent<T> = React.FunctionComponent<WrappedFieldProps & FieldProps<T>>

export const renderInputField: FieldComponent<InputProps> =
({ align, input, meta, decorate = {}, ...inputProps}) =>
    alignments[align](decorate, (
        <Input
            {...inputProps}
            value={input.value}
            onChange={input.onChange}
            onBlur={input.onBlur}
        />
    ))

export const renderNumberInputField: FieldComponent<InputNumberProps> =
({ align, input, meta, decorate = {}, ...inputProps}) =>
    alignments[align](decorate, (
        <InputNumber
            {...inputProps}
            value={input.value}
            onChange={input.onChange}
            onBlur={input.onBlur}
        />
    ))

export const renderSearchField: FieldComponent<SearchProps> =
({ align, input, meta, decorate = {}, ...searchProps}) =>
    alignments[align](decorate, (
        <Search
            {...searchProps}
            value={input.value}
            onChange={input.onChange}
            onBlur={input.onBlur}
        />
    ))

const alignments = {
    horizontal:  ({ title, colon }: IDecoratorProps, inputField: React.ReactNode) => (
        <Row style={{ marginBottom: 12, textAlign: 'right', lineHeight: '40px' }}>
            <Col span={4}>
                {title}{colon && <span style={{ margin: '0 8px 0 2px'}}>:</span>}
            </Col>
            <Col span={4}>
                {inputField}
            </Col>
        </Row>
    ),
    vertical: ({ title, colon }: IDecoratorProps, inputField: React.ReactNode) => (
        <>
            <div style={{ marginBottom: 8 }}>
                {title}{colon ? ':' : ''}
            </div>
            <div>
                {inputField}
            </div>
        </>
    )
}
