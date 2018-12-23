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