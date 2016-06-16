# react-dnd-scrollzone

Cross browser compatible scrolling containers for drag and drop interactions.

### Example

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
      <Scrollzone tag="section" buffer={150} speed={50} style={scrollStyle}>
        <DraggableItem />
        <DraggableItem />
        <DraggableItem />
      </Scrollzone>
    </main>
  );
}
```

### API

```js
<Scrollzone
  buffer={Number} // distance from edge to start scrolling (default 150)
  speed={Number}  // top speed, play around with this (default 30)
  tag={String}    // tag to render as (default "div")
/>
```
