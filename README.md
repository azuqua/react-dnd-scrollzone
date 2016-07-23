# react-dnd-scrollzone

Cross browser compatible scrolling containers for drag and drop interactions.

### Basic Example

```js
import React from 'react';
import Scrollzone from 'react-dnd-scrollzone';

import DraggableItem from './path/to/DraggableItem';

const scrollStyle = {
  overflowX: 'scroll',
  overflowY: 'scroll',
}

export default App(props) {
  return (
    <main>
      <header />
      <Scrollzone style={scrollStyle} >
        <DraggableItem />
        <DraggableItem />
        <DraggableItem />
      </Scrollzone>
    </main>
  );
}
```

### Easing Example

```js
import React from 'react';
import Scrollzone, { defaultHorizontalStrength, defaultVerticalStrength } from 'react-dnd-scrollzone';

import DraggableItem from './path/to/DraggableItem';

const scrollStyle = {
  overflowX: 'scroll',
  overflowY: 'scroll',
}

/**
 * @param {Number}  val - from -1 to 1
 * @return {Number} val - from -1 to 1
 */
function ease(val) {
  // this easing function is from https://gist.github.com/gre/1650294 and
  // expects/returns a number between [0, 1], however strength functions
  // expects/returns a value between [-1, 1]

  const t = val / 2 + 1; // [-1, 1] -> [0, 1]
  const easedT = t<.5 ? 2*t*t : -1+(4-2*t)*t;
  return easedT * 2 - 1; // [0, 1] -> [-1, 1]
}

function horizontalStrength(box, point) {
  return ease(defaultHorizontalStrength(box, point));
}

function verticalStrength(box, point) {
  return ease(defaultVerticalStrength(box, point));
}

export default App(props) {
  return (
    <main>
      <header />
      <Scrollzone style={scrollStyle} verticalStrength={verticalStrength} horizontalStrength={horizontalStrength} >
        <DraggableItem />
        <DraggableItem />
        <DraggableItem />
      </Scrollzone>
    </main>
  );
}
```


### API

#### `Scrollzone`

A React component with the following properties:

```js
<Scrollzone
  verticalStrength={Function}
  horizontalStrength={Function}
  speed={Number}
  tag={String|Component} >

  {children}

</Scrollzone>
```
 * `verticalStrength` - a function that returns the strength of the vertical scroll direction
 * `horizontalStrength` a function that returns the strength of the horizontal scroll direction
 * `speed` - strength multiplier, play around with this (default 30)
 * `tag` - tag to render as (default "div")

The strength functions are both called with two arguments. An object representing the rectangle occupied by the Scrollzone, and an object representing the coordinates of mouse.

They should return a value between -1 and 1.
 * Negative values scroll up or left.
 * Positive values scroll down or right.
 * 0 stops all scrolling.

#### `defaultVerticalStrength(box, point) -> Number`
The default vertical strength generating function. It linearly scales the
strength of vertical scroll as the cursor approaches a boundary.

Returns between -1 and 0 if the cursor is within 150 pixels of the top, and
returns between 0 and 1 if the cursor is within 150 pixels of the bottom.

#### `defaultHorizontalStrength(box, point) -> Number`
The default horizontal strength generating function. It linearly scales the
strength of horizontal scroll as the cursor approaches a boundary.

Returns between -1 and 0 if the cursor is within 150 pixels of the left, and
returns between 0 and 1 if the cursor is within 150 pixels of the right.

#### `createVerticalStrength(buffer)` and `createHorizontalStrength(buffer)`

These allow you to create their respective strength functions using a sensitivity different than 150px. This replaces the old `buffer` prop.

##### Example

```js
import Scrollzone, { createVerticalStrength, createHorizontalStrength } from 'react-dnd-scrollzone';

const vStrength = createVerticalStrength(500);
const hStrength = createHorizontalStrength(300);

// zone will scroll when the cursor drags within
// 500px of the top/bottom and 300px of the left/right
const zone = (
  <Scrollzone verticalStrength={vStrength} horizontalStrength={hStrength}>

  </Scrollzone>
);
```
