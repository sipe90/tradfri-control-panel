import R, { ObjPred } from 'ramda'

/**
 * Filters an object by returning a new object which contain only keys-value pairs that match the predicate
 * @param pred Filter predicate
 */
export const filterObj = (pred: ObjPred) => R.pickBy(R.apply(pred))