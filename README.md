# ticktock
A flexible JavaScript timer

It is very much based on [Mr. Chimps](https://github.com/mrchimp) excellent [Tock](https://github.com/mrchimp/tock).
The code has been ported to ES6 and there are some differences.

### Differences to [Tock](https://github.com/mrchimp/tock)

- This timer does not support the `countdown` option.
- `performance.now()` is used in favor of `Date.now()`
- The method `lap` is now called `elapsed`.
- There is a `resume` method (`pause` only pauses and does not resume the timer).
- The [Conversion Helpers](https://github.com/mrchimp/tock#conversion) are gone.
- `interval` is no longer an option - it's required.
    - It can be a function mapping the current tick to the time to wait until the next tick.
      It receives these arguments:
        - `time in ms (Number)`
        - `tick (Number)`
    - It can be an array containing times to wait.
    - It can be a number (like in Tock's API).
    - Whenever a falsy value is retrieved from `interval` the clock stops.
- `callback` is no longer an option - it's required.
  It receives these arguments:
    - `clock (TickTock)`
    - `time in ms (Number)`
    - `tick (Number)`
- `complete` receives these arguments:
    - `time in ms (Number)`
    - `tick (Number)`
    - `stopTime (Number)`
  
