<template>
  <div class="column-layout">
    <div class="column left">
      <slot name="left"></slot>
    </div>
    <div class="column right darkmode">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style scoped>
.column-layout {
  display: flex;
  height: 100%;
}
.column.left {
  flex: 1 1;
}

.overflow-hidden > .column.left {
  overflow: hidden;
}

.overflow-hidden > .column.right {
  overflow-y: auto;
  overflow-x: hidden;
}

.column.right {
  flex: 1 1;
}
.fixed-width-right > .column.right {
  flex: auto;
  min-width: 300px;
  max-width: 300px;
  border-left: 2px solid #999;
  margin-left: -2px;
}
.darkmode {
  background: black;
  color: white;
}
</style>
