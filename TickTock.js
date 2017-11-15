/**
* Based on 'Tock' by Mr Chimp - github.com/mrchimp/tock
* Based on code by James Edwards:
*    sitepoint.com/creating-accurate-timers-in-javascript/
*
* Different options:
* - removed: countdown
* - changed:
*   - interval (required):
*       Can be a function mapping the current tick to the time to wait until the next tick.
*       Can be an array containing times to wait. The TickTock must be stopped manually once each array element has been used.
*       Can be a number (like in Tock's API).
*       Whenever a falsy value is retrieved from 'interval' the clock stops.
*   - callback (required): Is now required.
*/

class TickTock {
    constructor(options={}) {
        this.is_running = false
        this.timeout = null
        this.missed_ticks = null
        this.start_time = 0
        this.stop_time = 0
        this.time = 0
        this.tick = 0

        this.interval = (
            typeof(options.interval) === 'function'
            // use given function
            ? options.interval
            : (
                Array.isArray(options.interval)
                // map tick to list item
                ? (time, tick) => options.interval[tick]
                // map tick to constant value
                : (time, tick) => options.interval
            )
        )
        this.callback = options.callback
        this.complete = options.complete
        this._tick = this._tick.bind(this)
    }

    start() {
        if (this.is_running) {
            throw new Error('Cannot start. TickTock is already running.')
        }
        this._startTimer(performance.now())
    }

    // Stop the clock and clear the timeout
    stop() {
        if (!this.is_running) {
            throw new Error('Cannot stop. TickTock is not running.')
        }
        this.stop_time = this.elapsed()
        this.is_running = false
        clearTimeout(this.timeout)
    }

    resume() {
        if (this.is_running) {
            throw new Error('Cannot resume. TickTock is already running.')
        }
        this._startTimer(performance.now() - this.stop_time)
    }

    reset() {
        this.start_time = 0
        this.time = 0
    }

    // Get the current clock time in ms.
    elapsed() {
        if (this.is_running) {
            return performance.now() - this.start_time
        }
        return this.stop_time
    }

    // Called for every tick.
    _tick() {
        this.callback(this, this.time, this.tick)
        const timeout = this.interval(this.time, this.tick)
        if (!timeout) {
            this.stop()
            this.complete && this.complete(this.time, this.tick, this.stop_time)
            return
        }

        this.time += timeout
        this.tick += 1

        const next_tick_in = this.start_time + this.time - performance.now()

        if (next_tick_in <= 0) {
            this.missed_ticks = Math.floor(-next_tick_in / timeout)
            this.time += this.missed_ticks * timeout

            if (this.is_running) {
                this._tick()
            }
        }
        else if (this.is_running) {
            this.timeout = setTimeout(this._tick, next_tick_in)
        }
    }

    _startTimer(start_time) {
        this.start_time = start_time
        this.is_running = true
        this.time = 0
        this.stop_time = 0
        this._tick()
    }
}

export {TickTock}
export default TickTock
