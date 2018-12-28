
import * as R from 'ramda'
import { AnyAction, Middleware } from 'redux'
import { Dictionary } from 'shared/types'

export const START_TIMER = 'START_TIMER'
export const STOP_TIMER = 'STOP_TIMER'

const timerMiddleware: Middleware = ({ dispatch }) => {

    interface ITimer {
        intervalId: number
    }

    const timers: Dictionary<ITimer> = {}

    return (next) => (action: AnyAction) => {
        R.cond([
            [R.equals(START_TIMER), () => {
                const { timerName, dispatchFunc, timerInterval = 1000 } = action.payload

                if (timers[timerName]) {
                    clearInterval(timers[timerName].intervalId)
                }

                timers[timerName] = {
                    intervalId: window.setInterval(() => dispatch(dispatchFunc), timerInterval),
                }
            }],
            [R.equals(STOP_TIMER), () => {
                const { timerName } = action.payload
                if (timers[timerName]) {
                    clearInterval(timers[timerName].intervalId)
                }
            }],
            [R.T, () => next(action)],
        ])(action.type)
    }
}

export default timerMiddleware
