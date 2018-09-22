const R = require('ramda')

const filterObj = (pred, obj) => R.pipe(
    R.toPairs,
    R.filter(R.apply(pred)),
    R.fromPairs
)(obj)

module.exports = {
    filterObj
}
