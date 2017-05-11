import React, { Component } from 'react';
import TouchBackend from 'react-dnd-touch-backend';
import { DragDropContextProvider } from 'react-dnd';
import withScrolling from 'react-dnd-scrollzone';
import DragItem from './DragItem';
import DragPreview from './DragPreview';
import './App.css';

const ScrollingComponent = withScrolling('div');

const ITEMS = [1,2,3,4,5,6,7,8,9,10];

export default class App extends Component {
  render() {
    return (
      <DragDropContextProvider backend={TouchBackend({ enableMouseEvents: true })}>
        <ScrollingComponent className="App">
          {ITEMS.map(n => (
            <DragItem key={n} label={`Item ${n}`} />
          ))}
          <DragPreview />
        </ScrollingComponent>
      </DragDropContextProvider>
    );
  }
}
