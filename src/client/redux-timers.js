
import * as R from 'ramda'

export const START_TIMER = 'START_TIMER';
export const STOP_TIMER = 'STOP_TIMER';

const timerMiddleware = ({ dispatch }) => {
    
    const timers = {}

    return next => action => {
        R.cond([
            [R.equals(START_TIMER), () => {
                const { timerName, dispatchFunc, timerInterval = 1000 } = action.payload

                if (timers[timerName]) {
                    clearInterval(timers[timerName].interval)
                }

                timers[timerName] = {
                    interval: setInterval(() => dispatch(dispatchFunc), timerInterval) 
                }
            }],
            [R.equals(STOP_TIMER), () => { 
                const { timerName } = action.payload
                if (timers[timerName]) {
                    clearInterval(timers[timerName].interval)
                }
            }],
            [R.T, () => next(action)]
        ])(action.type)
    }
}

export default timerMiddleware
