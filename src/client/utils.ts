import R from 'ramda'
import { normalize, Schema } from 'normalizr'
import { Group, Dictionary, Device } from 'shared/types';
import { NormalizeResult, PayloadAction } from 'types';
import { Action } from 'redux';

export const devicesForGroup = (group: Group, devices: Dictionary<Device>) => R.values(R.pick(R.map(String, group.devices), devices))

export const normalizer = (schema: Schema): (data: any) => NormalizeResult => R.curry(R.flip(normalize))(schema);

type ActionReducePair<S, A> = [string, (state: S, action: A) => S];
type ActionPredicateReducePair<S> = [(action: string) => boolean, () => S]

export const createReducer = <S, A extends Action = PayloadAction> (cases: Array<ActionReducePair<S, A>>) => (state: S, action: A) =>
    R.cond(
        R.map<ActionReducePair<S, A>, ActionPredicateReducePair<S>>(([act, reduce]) => [R.equals(act), () => reduce(state, action)], cases)
        .concat([R.T, R.always(state)])
    )(action.type)

type JsonResponse<R> = ({
    headers: Headers
    status: number
    statusText: string
} & ({
        ok: true
        json: R
    } | {
        ok: false
        json: ErrorResponse
    })
)

interface ErrorResponse {
    field: string
    message: string
    stack?: string
}

const fetchJson = async <R> (url: string, init?: RequestInit): Promise<JsonResponse<R>> => {
    const { headers, status, statusText, ok, json } = await fetch(url, init)
    const resJson = await json()

    return ok ? {
        headers,
        status,
        statusText,
        ok: true,
        json: resJson as R,
    } : {
        headers,
        status,
        statusText,
        ok: false,
        json: resJson as ErrorResponse
    }
}

export const fetchGetJson = <R = any> (url: string) => fetchJson<R>(url)

export const fetchPostJson = <R = any> (url: string, body: object | string) =>
    fetchJson<R>(url, {
        method: 'POST', 
        body: typeof body === 'string' ? body : JSON.stringify(body), 
        headers: { 'content-type': 'application/json' }
    })

export const fetchDeleteJson = <R = any> (url: string) => fetchJson<R>(url, { method: 'DELETE' })
