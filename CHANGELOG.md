# Changelog

### `v2.0.0`
* Remove `buffer` prop.
* Add `horizontalStrength` and `verticalStrength` props.
* Add `createVerticalStrength` and `createHorizontalStrength` exports.
* Fix bug with strength calculations and large buffers.
* Fix bug with scrolling not always stopping when drop targets are nested.

##### Before (v1)
```js
import Scrollzone from 'react-dnd-scrollzone';
const zone = <Scrollzone buffer={300} />;
```

##### After (v2)
```js
import Scrollzone, { createVerticalStrength, createHorizontalStrength } from 'react-dnd-scrollzone';
const vStrength = createVerticalStrength(300);
const hStrength = createHorizontalStrength(300);
const zone = <Scrollzone verticalStrength={vStrength} horizontalStrength={hStrength} />;
```

### `v1.1.0`
* Initial release.
