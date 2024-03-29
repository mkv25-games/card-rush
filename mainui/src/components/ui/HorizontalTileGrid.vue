<template>
  <div>
    <div class="tile-grid" :style="gridStyle()">
      <div :class="previousPageClass()" v-on:click="previousPage">
         <font-awesome-icon :icon="['fas', 'caret-left']" />
      </div>
      <div class="tile-grid-items">
        <div v-for="tile in tilesInView" :style="style(tile)" :key="tile.id" :title="tile.icon" class="tile-grid-item">
          <font-awesome-icon :icon="['fas', tile.icon]" />
        </div>
        <div v-for="tile in emptyTiles" :style="style(tile)" :key="tile.id" class="tile-grid-item empty">
          <font-awesome-icon :icon="['fas', 'expand']" />
        </div>
      </div>
      <div :class="nextPageClass()" v-on:click="nextPage">
         <font-awesome-icon :icon="['fas', 'caret-right']" />
      </div>
    </div>
    <div v-if="showPageMarkers" class="page-markers">
      <font-awesome-icon
        v-for="page in pages" :icon="['fas', page.icon]"
        :key="page.id" :class="page.className"
        v-on:click="gotoPage(page.id)" />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      viewPosition: 0
    }
  },
  props: {
    tiles: Array,
    columns: Number,
    rows: Number,
    tileWidth: Number,
    tileHeight: Number,
    showPageMarkers: Boolean
  },
  computed: {
    tilesInView () {
      return this.tiles.slice(this.viewPosition, this.viewPosition + this.pageSize)
    },
    emptyTiles () {
      const tiles = []
      const emptyTileCount = Math.max(0, this.pageSize - this.tilesInView.length)
      while (tiles.length < emptyTileCount) {
        tiles.push({})
      }
      return tiles
    },
    pages () {
      const items = []
      while (items.length < this.maxPages) {
        const pageId = items.length
        let className = pageId === this.currentPage ? 'selected' : 'after'
        className = pageId < this.currentPage ? 'before' : className
        let icon = pageId === 0 ? 'caret-square-left' : 'square'
        icon = pageId >= this.maxPages - 1 ? 'caret-square-right' : icon
        items.push({
          id: items.length,
          className,
          icon
        })
      }
      return items
    },
    pageSize () {
      return (this.rows || 2) * (this.columns || 2)
    },
    nextPageDisabled () {
      const nextPage = this.currentPage + 1
      return nextPage >= this.maxPages
    },
    previousPageDisabled () {
      return (this.viewPosition === 0)
    },
    currentPage () {
      return Math.floor(this.viewPosition / this.pageSize)
    },
    maxPages () {
      return Math.ceil(this.tiles.length / this.pageSize)
    }
  },
  methods: {
    style (tile) {
      return `width: ${this.tileWidth}px; height: ${this.tileHeight}px;`
    },
    gridStyle () {
      const gridWidth = (this.tileWidth || 100) * (this.columns || 2) + (30 * 2)
      const gridHeight = (this.tileHeight || 100) * (this.rows || 2)
      return `width: ${gridWidth}px; height: ${gridHeight}px;`
    },
    previousPageClass () {
      const disabled = this.previousPageDisabled ? 'disabled' : false
      return ['scroll-prev', 'grid-button', disabled].filter(n => n).join(' ')
    },
    nextPageClass () {
      const disabled = this.nextPageDisabled ? 'disabled' : false
      return ['scroll-next', 'grid-button', disabled].filter(n => n).join(' ')
    },
    previousPage () {
      this.viewPosition = Math.max(0, this.viewPosition - this.pageSize)
      return false
    },
    nextPage () {
      if (!this.scrollDownDisabled) {
        const maxViewPosition = this.pageSize * (this.maxPages - 1)
        this.viewPosition = Math.min(maxViewPosition, this.viewPosition + this.pageSize)
      }
      return false
    },
    gotoPage (pageId) {
      this.viewPosition = pageId * this.pageSize
    }
  }
}
</script>

<style scoped>
.tile-grid {
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  margin: auto;
  outline: 1px solid #333;
  color: #222;
  border-radius: 4px;
}

.scroll-prev {
  border-radius: 4px 0 0 4px;
}

.tile-grid-items {
  display: inline-flex;
  flex-flow: row wrap;
}

.tile-grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: auto;
  outline: 2px solid #333;
  outline-offset: -2px;
}

.tile-grid-item.empty {
  background: #222;
  color: #333;
}

.scroll-next {
  border-radius: 0 4px 4px 0;
}

.grid-button {
  display: inline-flex;
  min-width: 30px;
  max-width: 30px;
  flex: 1 1;
  height: 100%;
  color: white;
  background: #222;
  outline: 1px solid #333;
  outline-offset: -1px;
  font-size: 24px;
  cursor: pointer;
  user-select: none;
  align-items: center;
  justify-content: center;
}
.grid-button:hover {
  background: #333;
}
.grid-button:active {
  background: #111;
}
.grid-button.disabled {
  color: #999;
  background: #444;
  cursor: default;
}
.page-markers {
  flex: auto;
  text-align: center;
}
.page-markers > * {
  font-size: 0.8em;
  margin: 0 0.1em;
  cursor: pointer;
}
.page-markers .before {
  opacity: 0.2;
}
.page-markers .selected {
  color: black;
}
.page-markers .after {
  opacity: 0.6;
}
.page-markers > *:hover {
  opacity: 0.8;
}
</style>
