import { LOAD_CIRCADIAN_SETTINGS_SUCCESS} from '@/actions/settings'
import { ActionReducers, createReducer } from '@/utils'
import { ICircadianSettings } from 'shared/types'

export interface ISettingsEntitiesState {
    circadian: ICircadianSettings | null
}

const initialState = {
    circadian: null
}

const reducers: ActionReducers<ISettingsEntitiesState> = [
    [LOAD_CIRCADIAN_SETTINGS_SUCCESS, (state, { payload }) => ({
        ...state,
        circadian: payload
    })],
]

export default createReducer(reducers, initialState)
