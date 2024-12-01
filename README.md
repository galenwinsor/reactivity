# Reactivity Experiments

This repo contains four different approaches to state management and reactivity
in JS: imperative, observables, signals, and functional (React).

## Imperative

The imperative approach is simplest, using global, mutable variables for state
and then using event listeners to directly update state and update DOM
attributes based on the new state. Imperative state management requires the
developer to explicitly define state and UI relationships.

## Observables and Observers

An `Observable` is an object that represents a stream of values that update over
time, to which `Observer` objects can subscribe and receive updates when new
values are pushed to the stream. `Observer`s implement three methods: `next`,
`error`, and `complete`.

For example, a common example of an observable is a stream of DOM events on a
particular element, to which observers can subscribe and receive a notification
every time an event of that type occurs on that element.

## Signals and Effects

Signals are similar to observers, except that while observers require explicit
subscription and dependency declaration, signals implicitly track dependencies
between state. A _signal_ is simply an object with a getter and a setter, which
tracks _effects_ that reference the signal's value (i.e., the signals
subscribers). Whenever the signal's value is updated, all subscribed effects are
run.

## Functional (React)

The React approach to state management uses functional programming principles to
crate a uni-directional, top-down approach to resolving state values and
dependencies. UI components and their state are laid out in a tree structure,
with state variables resolving one after the other, always in the same order.
Because the order of state resolution is the same on every iteration, the
dependencies of state always receive the most up-to-date, relevant value.
