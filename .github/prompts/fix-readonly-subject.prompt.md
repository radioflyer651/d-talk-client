---
mode: agent
description: 'Refactor ReadonlySubject into normal observable.'
tools: ['codebase', 'usages', 'problems', 'search']
---

# Purpose
`ReadonlySubject` is obsolete, and a bad idea.  We need to replace it with an observable and properties that perform the same job.

## Information
`ReadonlySubjects` were meant to be an observable that could be subscribed to, and also maintained a readonly value which updated anytime the source observable changed.

### Features of `ReadonlySubject`
  - The constructor took 2 observables as input.
    1. An observable which, when `complete`d, would `complete` the `ReadonlySubject`.
    2. A source observable to watch and both update its local value, as well as emit signals as they were received.
  - Similar mechanics need to take part in the new implementation.

### Common Implementations
  - Usually, when implementing a `ReadonlySubject`, it included the following implementations:
    - The `ReadonlySubject` was a private property of the owner.
    - The `ReadonlySubject` was constructed in the `ngOnInit` or the `constructor` of the class.
    - A property was exposed to get the value of the `ReadonlySubject`.
    - A property was exposed to emit changes of the `ReadonlySubject`, as a plain observable.

### Fix Requirements
To refactor/fix this implementation, the following must be done:
  - Replace the `ReadonlySubject` with a normal observable.
    - This should implement a `takeUntil` in its pipe, and use the first parameter of the `ReadonlySubject` as the input.
    - Subscribe to this new observable to make updates to the new value property described below.
  - Create a property to expose the emissions of the new observable.
  - Create a property to expose the value of the new observable.
    - A subscription must be created on the new observable that updates this property upon changes.

Perform the fixes specified above in the current file.  Perform any other tasks that would be required to keep the existing code functional.