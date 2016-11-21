# react-dnd-scrollzone

Cross browser compatible scrolling containers for drag and drop interactions.

### Basic Example

```js
import React from 'react';
import withScrolling from 'react-dnd-scrollzone';
import DraggableItem from './path/to/DraggableItem';

const ScrollZone = withScrolling('ul');
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
import withScrolling, { createHorizontalStrength, createVerticalStrength } from 'react-dnd-scrollzone';
import DraggableItem from './path/to/DraggableItem';

const ScrollZone = withScrolling('ul');
const linearHorizontalStrength = createHorizontalStrength(150);
const linearVerticalStrength = createVerticalStrength(150);

// this easing function is from https://gist.github.com/gre/1650294 and
// expects/returns a number between [0, 1], however strength functions
// expects/returns a value between [-1, 1]
function ease(val) {
  const t = val / 2 + 1; // [-1, 1] -> [0, 1]
  const easedT = t<.5 ? 2*t*t : -1+(4-2*t)*t;
  return easedT * 2 - 1; // [0, 1] -> [-1, 1]
}

function hStrength(box, point) {
  return ease(linearHorizontalStrength(box, point));
}

function vStrength(box, point) {
  return ease(linearVerticalStrength(box, point));
}

export default App(props) {
  return (
    <main>
      <header />
      <Scrollzone verticalStrength={vStrength} horizontalStrength={hStrength} >
        <DraggableItem />
        <DraggableItem />
        <DraggableItem />
      </Scrollzone>
    </main>
  );
}
```


### API

#### `withScrolling`

A React higher order component with the following properties:

```js
const ScrollZone = withScrolling(String|Component);

<ScrollZone
  horizontalStrength={Function}
  verticalStrength={Function}
  onScrollChange={Function}
  speed={Number} >

  {children}
</Scrollzone>
```
Apply the withScrolling function to any html-identifier ("div", "ul" etc) or react component to add drag and drop scrolling behaviour.

 * `horizontalStrength` a function that returns the strength of the horizontal scroll direction
 * `verticalStrength` - a function that returns the strength of the vertical scroll direction
 * `onScrollChange` - a function that is called when `scrollLeft` or `scrollTop` of the component are changed. Called with those two arguments in that order.
 * `speed` - strength multiplier, play around with this (default 30)

The strength functions are both called with two arguments. An object representing the rectangle occupied by the Scrollzone, and an object representing the coordinates of mouse.

They should return a value between -1 and 1.
 * Negative values scroll up or left.
 * Positive values scroll down or right.
 * 0 stops all scrolling.

#### `createVerticalStrength(buffer)` and `createHorizontalStrength(buffer)`

These allow you to create linearly scaling strength functions with a sensitivity different than the default value of 150px. This replaces the old `buffer` prop.

##### Example

```js
import withScrolling, { createVerticalStrength, createHorizontalStrength } from 'react-dnd-scrollzone';

const ScrollZone = withScrolling('ul');
const vStrength = createVerticalStrength(500);
const hStrength = createHorizontalStrength(300);

// zone will scroll when the cursor drags within
// 500px of the top/bottom and 300px of the left/right
const zone = (
  <Scrollzone verticalStrength={vStrength} horizontalStrength={hStrength}>

  </Scrollzone>
);
```

#### Add DND scrolling to existing components

Since react-dnd-scrollzone utilizes the Higher Order Components (HOC) pattern, drag and drop scrolling behaviour can easily be added to existing components. For example to speedup huge lists by using [react-virtualized](https://github.com/bvaughn/react-virtualized) for a windowed view where only the visible rows are rendered:

##### Example

```js
import React from 'react';
import withScrolling, { createVerticalStrength } from 'react-dnd-scrollzone';
import { List } from 'react-virtualized';
import DraggableItem from './path/to/DraggableItem';

// creates array with 1000 entries
const testArray = Array.from(Array(1000)).map((e,i)=>'Item '+i);

const ScrollZoneVirtualList = withScrolling(List);
const vStrength = createVerticalStrength(200);

export default App(props) {
  return (
    <main>
      <header />
      <ScrollZoneVirtualList
        verticalStrength={vStrength}
        horizontalStrength={ ()=>{} }
        speed={200}
        height={600}
        width={800}
        rowCount={testArray.length}
        rowHeight={34}
        rowRenderer={
          ({ key, index, style }) => {
            return <DraggableItem key={key} style={style} content={testArray[index]}/>
          }
        }
       />
    </main>
  );
}
```
