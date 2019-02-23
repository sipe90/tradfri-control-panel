import R, { ObjPred } from 'ramda'

/**
 * Filters an object by returning a new object which contain only keys-value pairs that match the predicate
 * @param pred Filter predicate
 */
export const filterObj = (pred: ObjPred) => R.pickBy(R.apply(pred))

/**
 * Returns true if any of the values if the given object is null or undefined
 * @param obj The object to check
 */
export const isAnyValueNil = (obj: object) => R.any(R.isNil, R.values(obj))

/**
 * Returns a function which returns null if the given object/array/string is empty. Otherwise returns the object.
 */
export const nullIfEmpty = R.ifElse(
    R.isEmpty,
    R.always(null),
    R.identity
)
