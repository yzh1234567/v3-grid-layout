<script setup>
import {
  reactive,
  onMounted,
} from 'vue';
import GridItem from './components/GridItem.vue';
import GridLayout from './components/GridLayout.vue';
// import ResponsiveGridLayout from './components/ResponsiveGridLayout.vue';
import TestElement from './components/TestElement.vue';
// import CustomDragElement from './components/CustomDragElement.vue';
import { getDocumentDir, setDocumentDir } from './helpers/DOM';
// var eventBus = require('./eventBus');

const testLayout = [
  { x: 0, y: 0, w: 2, h: 2, i: '0', resizable: true, draggable: true, static: false, minY: 0, maxY: 2 },
  { x: 2, y: 0, w: 2, h: 4, i: '1', resizable: null, draggable: null, static: true },
  { x: 4, y: 0, w: 2, h: 5, i: '2', resizable: false, draggable: false, static: false, minX: 4, maxX: 4, minW: 2, maxW: 2, preserveAspectRatio: true },
  { x: 6, y: 0, w: 2, h: 3, i: '3', resizable: false, draggable: false, static: false, preserveAspectRatio: true },
  { x: 8, y: 0, w: 2, h: 3, i: '4', resizable: false, draggable: false, static: false },
  { x: 10, y: 0, w: 2, h: 3, i: '5', resizable: false, draggable: false, static: false },
  { x: 0, y: 5, w: 2, h: 5, i: '6', resizable: false, draggable: false, static: false },
  { x: 2, y: 5, w: 2, h: 5, i: '7', resizable: false, draggable: false, static: false },
  { x: 4, y: 5, w: 2, h: 5, i: '8', resizable: false, draggable: false, static: false },
  { x: 6, y: 3, w: 2, h: 4, i: '9', resizable: false, draggable: false, static: true },
  { x: 8, y: 4, w: 2, h: 4, i: '10', resizable: false, draggable: false, static: false },
  { x: 10, y: 4, w: 2, h: 4, i: '11', resizable: false, draggable: false, static: false, minY: 4 },
  { x: 0, y: 10, w: 2, h: 5, i: '12', resizable: false, draggable: false, static: false },
  { x: 2, y: 10, w: 2, h: 5, i: '13', resizable: false, draggable: false, static: false },
  { x: 4, y: 8, w: 2, h: 4, i: '14', resizable: false, draggable: false, static: false },
  { x: 6, y: 8, w: 2, h: 4, i: '15', resizable: false, draggable: false, static: false },
  { x: 8, y: 10, w: 2, h: 5, i: '16', resizable: false, draggable: false, static: false },
  { x: 10, y: 4, w: 2, h: 2, i: '17', resizable: false, draggable: false, static: false },
  { x: 0, y: 9, w: 2, h: 3, i: '18', resizable: false, draggable: false, static: false },
  { x: 2, y: 6, w: 2, h: 2, i: '19', resizable: false, draggable: false, static: false },
];

/* let testLayout = [
        { x: 0, y: 0, w: 2, h: 2, i: "0" },
        { x: 2, y: 0, w: 2, h: 2, i: "1" },
        { x: 4, y: 0, w: 2, h: 2, i: "2" },
        { x: 6, y: 0, w: 2, h: 2, i: "3" },
        { x: 8, y: 0, w: 2, h: 2, i: "4" },
    ]; */

const state = reactive({
  layout: JSON.parse(JSON.stringify(testLayout)),
  layout2: JSON.parse(JSON.stringify(testLayout)),
  draggable: true,
  resizable: true,
  mirrored: false,
  responsive: true,
  bounded: false,
  transformScale: 1,
  preventCollision: false,
  compact: true,
  restoreOnDrag: true,
  rowHeight: 30,
  colNum: 12,
  index: 0,
  marginX: 10,
  marginY: 10,
});

onMounted(() => {
  state.index = state.layout.length;
});

// function clicked()  {
//   window.alert("CLICK!");
// }

function increaseWidth() {
  let width = document.getElementById('content').offsetWidth;
  width += 20;
  document.getElementById('content').style.width = `${width}px`;
}

function decreaseWidth() {
  let width = document.getElementById('content').offsetWidth;
  width -= 20;
  document.getElementById('content').style.width = `${width}px`;
}

function scaleHalf() {
  state.transformScale = 0.5;
  document.getElementById('grid-layout').style.transform = 'scale(0.5)';
}

function scaleThreeQuarters() {
  state.transformScale = 0.75;
  document.getElementById('grid-layout').style.transform = 'scale(0.75)';
}

function scaleIdentity() {
  state.transformScale = 1;
  document.getElementById('grid-layout').style.transform = 'scale(1)';
}

function removeItem(i) {
  console.log(`### REMOVE ${i}`);
  const index = state.layout.map(item => item.i).indexOf(i);
  state.layout.splice(index, 1);
}

function addItem() {
  // let self = state;
  // console.log("### LENGTH: " + state.layout.length);
  const item = { x: 0, y: 0, w: 2, h: 2, i: `${state.index}`, whatever: 'bbb' };
  state.index++;
  state.layout.push(item);
}

function addItemDynamically() {
  const x = (state.layout.length * 2) % (state.colNum || 12);
  const y = state.layout.length + (state.colNum || 12);
  console.log(`X=${x} Y=${y}`);
  const item = {
    x,
    y,
    w: 2,
    h: 2,
    i: `${state.index}`,
  };
  state.index++;
  state.layout.push(item);
}

function move(i, newX, newY) {
  console.log(`MOVE i=${i}, X=${newX}, Y=${newY}`);
}

function resize(i, newH, newW, newHPx, newWPx) {
  console.log(`RESIZE i=${i}, H=${newH}, W=${newW}, H(px)=${newHPx}, W(px)=${newWPx}`);
}

function moved(i, newX, newY) {
  console.log(`### MOVED i=${i}, X=${newX}, Y=${newY}`);
}

function resized(i, newH, newW, newHPx, newWPx) {
  console.log(`### RESIZED i=${i}, H=${newH}, W=${newW}, H(px)=${newHPx}, W(px)=${newWPx}`);
}

function containerResized(i, newH, newW, newHPx, newWPx) {
  console.log(`### CONTAINER RESIZED i=${i}, H=${newH}, W=${newW}, H(px)=${newHPx}, W(px)=${newWPx}`);
}

/**
 * Add change direction button
 */
function changeDirection() {
  const documentDirection = getDocumentDir();
  let toggle = '';
  if (documentDirection === 'rtl') {
    toggle = 'ltr';
  } else {
    toggle = 'rtl';
  }
  setDocumentDir(toggle);
  // eventBus.$emit('directionchange');
}

function layoutCreatedEvent(newLayout) {
  console.log('Created layout: ', newLayout);
}

function layoutBeforeMountEvent(newLayout) {
  console.log('beforeMount layout: ', newLayout);
}

function layoutMountedEvent(newLayout) {
  console.log('Mounted layout: ', newLayout);
}

function layoutReadyEvent(newLayout) {
  console.log('Ready layout: ', newLayout);
}

function layoutUpdatedEvent(newLayout) {
  console.log('Updated layout: ', newLayout);
}
function breakpointChangedEvent(newBreakpoint, newLayout) {
  console.log('breakpoint changed breakpoint=', newBreakpoint, ', layout: ', newLayout);
}
</script>
<template>
  <div id="app">
    <h1 style="text-align: center">Vue Grid Layout</h1>
    <!--<pre>{{ layout | json }}</pre>-->
    <div>
      <div class="layoutJSON">
        Displayed as <code>[x, y, w, h]</code>:
        <div class="columns">
          <div class="layoutItem" v-for="item in state.layout" :key="item.i">
            <b>{{item.i}}</b>: [{{item.x}}, {{item.y}}, {{item.w}}, {{item.h}}]
          </div>
        </div>
      </div>
      <!--<div class="layoutJSON">
        Displayed as <code>[x, y, w, h]</code>:
        <div class="columns">
          <div class="layoutItem" v-for="item in layout2">
            <b>{{item.i}}</b>: [{{item.x}}, {{item.y}}, {{item.w}}, {{item.h}}]
          </div>
        </div>
      </div>-->
    </div>
    <div id="content">
      <button @click="decreaseWidth">Decrease Width</button>
      <button @click="increaseWidth">Increase Width</button>
      <button @click="scaleHalf">Scale x0.5</button>
      <button @click="scaleThreeQuarters">Scale x0.75</button>
      <button @click="scaleIdentity">Scale x1.0</button>
      <button @click="addItem">Add an item</button>
      <button @click="addItemDynamically">Add an item dynamically</button>
      <!-- Add to show rtl support -->
      <button @click="changeDirection">Change Direction</button>
      <input type="checkbox" v-model="state.draggable"/> Draggable
      <input type="checkbox" v-model="state.resizable"/> Resizable
      <input type="checkbox" v-model="state.mirrored"/> Mirrored
      <input type="checkbox" v-model="state.bounded"/> Bounded
      <input type="checkbox" v-model="state.responsive"/> Responsive
      <input type="checkbox" v-model="state.preventCollision"/> Prevent Collision
      <input type="checkbox" v-model="state.compact"/> Vertical Compact
      <div style="margin-top: 10px;margin-bottom: 10px;">
        Row Height: <input type="number" v-model="state.rowHeight"/>
        Col nums: <input type="number" v-model="state.colNum"/>
        Margin x: <input type="number" v-model="state.marginX"/>
        Margin y: <input type="number" v-model="state.marginY"/>
      </div>
      <grid-layout
        id="grid-layout"
        :margin="[parseInt(state.marginX), parseInt(state.marginY)]"
        v-model:layout="state.layout"
        :col-num="parseInt(state.colNum)"
        :row-height="state.rowHeight"
        :is-draggable="state.draggable"
        :is-resizable="state.resizable"
        :is-mirrored="state.mirrored"
        :is-bounded="state.bounded"
        :prevent-collision="state.preventCollision"
        :vertical-compact="state.compact"
        :restore-on-drag="state.restoreOnDrag"
        :use-css-transforms="true"
        :responsive="state.responsive"
        :transformScale="state.transformScale"
        @layout-created="layoutCreatedEvent"
        @layout-before-mount="layoutBeforeMountEvent"
        @layout-mounted="layoutMountedEvent"
        @layout-ready="layoutReadyEvent"
        @layout-updated="layoutUpdatedEvent"
        @breakpoint-changed="breakpointChangedEvent"
      >
        <grid-item v-for="item in state.layout"
          :key="item.i"
          :static="item.static"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :min-w="item.minW"
          :max-w="item.maxW"
          :min-x="item.minX"
          :max-x="item.maxX"
          :min-y="item.minY"
          :max-y="item.maxY"
          :preserve-aspect-ratio="item.preserveAspectRatio"
          @resize="resize"
          @move="move"
          @resized="resized"
          @container-resized="containerResized"
          @moved="moved"
        >
          <!--<custom-drag-element :text="item.i"></custom-drag-element>-->
          <test-element :text="item.i" @removeItem="removeItem($event)"></test-element>
          <!--<button @click="clicked">CLICK ME!</button>-->
        </grid-item>
      </grid-layout>
      <hr/>
      <!--<grid-layout
        :layout="layout2"
        :col-num="12"
        :row-height="rowHeight"
        :is-draggable="draggable"
        :is-resizable="resizable"
        :vertical-compact="true"
        :use-css-transforms="true"
      >
        <grid-item v-for="item in layout2" :key="item.i"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :min-w="2"
          :min-h="2"
          :i="item.i"
          :is-draggable="item.draggable"
          :is-resizable="item.resizable"
        >
          <test-element :text="item.i"></test-element>
        </grid-item>
      </grid-layout>-->
    </div>
  </div>
</template>
<style>
/*
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
 */
</style>

<style lang="css">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  /*margin-top: 60px;*/
}
</style>
