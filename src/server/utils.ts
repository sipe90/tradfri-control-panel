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
