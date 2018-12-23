import { Action } from 'redux'

export interface PayloadAction<P = any, T = any> extends Action<T> {
    payload?: P
}

export interface NormalizeResult {
    result: any
    entities: any
}

export interface ErrorResponse {
    message: string
}

export interface ConnectionTestResult {
    success: boolean
    error: string | null
}