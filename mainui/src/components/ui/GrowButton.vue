<template>
  <div class="grow-button">
    <slot>Click me!</slot>
  </div>
</template>

<style>
.grow-button {
  margin: 2px 0;
}
.grow-button a {
  display: inline-block;
  color: gold;
  font-weight: 700;
  text-decoration: none;
  border-left: 4px solid gold;
  border-right: 4px solid gold;
  border-radius: 10px;
  background: rgba(140, 5, 5, 0.7);
  transition: background 250ms, border 1s, padding 200ms ease-in-out;
  user-select: none;
  padding: 10px 40px;
  width: 60%;
}
.grow-button:hover a {
  color: lightskyblue;
  border-left: 4px solid lightpink;
  border-right: 4px solid lightpink;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px 10px;
}
.grow-button:active a {
  color: white;
  border-color: white;
  background: rgba(0, 0, 0, 0.9);
  padding: 10px;
}
</style>
