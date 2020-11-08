
import * as R from 'ramda'
import { AnyAction, Middleware } from 'redux'
import { Dictionary } from '@tradfri-control-panel/shared'

export const START_TIMER = 'START_TIMER'
export const STOP_TIMER = 'STOP_TIMER'

const timerMiddleware: Middleware = ({ dispatch }) => {

    interface Timer {
        intervalId: number
    }

    const timers: Dictionary<Timer> = {}

    return (next) => (action: AnyAction) => {
        const { type, payload } = action
        R.cond<any, void>([
            [R.equals(START_TIMER), () => {
                const { timerName, dispatchFunc, timerInterval = 1000 } = payload

                if (timers[timerName]) {
                    clearInterval(timers[timerName].intervalId)
                }

                timers[timerName] = {
                    intervalId: window.setInterval(() => dispatch(dispatchFunc), timerInterval),
                }
            }],
            [R.equals(STOP_TIMER), () => {
                const { timerName } = payload
                if (timers[timerName]) {
                    clearInterval(timers[timerName].intervalId)
                }
            }],
            [R.T, () => next(action)],
        ])(type)
    }
}

export default timerMiddleware
