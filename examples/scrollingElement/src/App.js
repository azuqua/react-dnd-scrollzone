import React, { Component } from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';
import withScrolling from 'react-dnd-scrollzone';
import DragItem from './DragItem';
import './App.css';

const ScrollingComponent = withScrolling('div');

const ITEMS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];

export default class App extends Component {
  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <ScrollingComponent scrollingElement className="App">
          {ITEMS.map(n => (
            <DragItem key={n} label={`Item ${n}`} />
          ))}
        </ScrollingComponent>
      </DragDropContextProvider>
    );
  }
}
