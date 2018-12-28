import * as utils from '@/utils'

describe('Create reducer', () => {

    it('Should create a reducer with empty cases', () => {

        const action = {
            type: '1'
        }
        const reducer = utils.createReducer([])

        expect(reducer({}, action)).toEqual({})
    })
})
