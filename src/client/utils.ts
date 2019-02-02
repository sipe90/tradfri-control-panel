import { INormalizeResult, IPayloadAction } from '@/types'
import { normalize, Schema } from 'normalizr'
import * as R from 'ramda'
import { Action, Reducer } from 'redux'

import { Dictionary, IDevice, IGroup } from 'shared/types'

export const devicesForGroup = (group: IGroup, devices: Dictionary<IDevice>) =>
    R.values(R.pick(R.map(String, group.devices), devices))

export const normalizer = (schema: Schema): (data: any) => INormalizeResult => R.curry(R.flip(normalize))(schema)

type ReduceFn<S, A> = (state: S, action: A) => S
type ActionPredicate = (action: string) => boolean

type ActionReducePair<S, A> = [string, ReduceFn<S, A>]
type ActionPredicateReducePair<S> = [ActionPredicate, () => S]

export type ActionReducers<S, A extends Action = IPayloadAction> = Array<ActionReducePair<S, A>>

export const createReducer = <S, A extends Action = IPayloadAction>(
    actionReducers: ActionReducers<S, A>,
    initialState: S
): Reducer<S, A> =>
    (state: S | undefined, action: A) =>
        R.cond(
            R.map<ActionReducePair<S, A>, ActionPredicateReducePair<S>>(
                ([act, reduce]) => [R.equals(act), () => reduce(state || initialState, action)],
                actionReducers
            )
            .concat([[R.T, R.always(state || initialState)]]),
        )(action.type)

type JsonResponse<E> = ({
    headers: Headers
    status: number
    statusText: string
} & ({
        ok: true
        json: E
    } | {
        ok: false
        json: IErrorResponse | null
    })
)

interface IErrorResponse {
    field: string
    message: string
    stack?: string
}

const isJsonResponse = (headers: Headers) => (headers.get('content-type') || '').includes('application/json')

const fetchJson = async <E> (url: string, init?: RequestInit): Promise<JsonResponse<E>> => {
    const res = await fetch(url, init)
    const { headers, json, ok, status, statusText } = res

    const resJson = isJsonResponse(headers) ? await json.call(res) : null

    return ok ? {
        headers,
        json: resJson as E,
        ok,
        status,
        statusText,
    } : {
        headers,
        json: resJson as IErrorResponse,
        ok,
        status,
        statusText,
    }
}

export const fetchGetJson = <E = any> (url: string) => fetchJson<E>(url)

export const fetchPostJson = <E = any> (url: string, body?: object | string) =>
    fetchJson<E>(url, {
        body: typeof body === 'string' ? body : JSON.stringify(body),
        headers: typeof body === 'undefined' ? undefined : { 'content-type': 'application/json' },
        method: 'POST',
    })

export const fetchDeleteJson = <E = any> (url: string) => fetchJson<E>(url, { method: 'DELETE' })
