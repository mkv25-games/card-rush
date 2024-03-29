<template>
  <div>
    <div class="tile-grid" :style="gridStyle()">
      <div :class="previousPageClass()" v-on:mousedown="previousPage" v-on:mouseup="clearRepeat('previousPage')" v-on:mouseout="clearRepeat('previousPage')">
         <font-awesome-icon :icon="['fas', 'caret-up']" />
      </div>
      <div v-for="tile in tilesInView" :style="style(tile)" :key="tile.id" :title="tile.icon" class="tile-grid-item">
        <slot :tile="tile">
          <font-awesome-icon :icon="['fas', tile.icon || 'star']" />
        </slot>
      </div>
      <div v-for="tile in emptyTiles" :style="style(tile)" :key="tile.id" class="tile-grid-item empty">
        <font-awesome-icon :icon="['fas', 'expand']" />
      </div>
      <div :class="nextPageClass()" v-on:mousedown="nextPage" v-on:mouseup="clearRepeat('nextPage')" v-on:mouseout="clearRepeat('nextPage')">
         <font-awesome-icon :icon="['fas', 'caret-down']" />
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
      viewPosition: 0,
      repeats: {}
    }
  },
  props: {
    tiles: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Number,
      default: 1
    },
    rows: {
      type: Number,
      default: 1
    },
    tileWidth: {
      type: Number,
      default: 50
    },
    tileHeight: {
      type: Number,
      default: 50
    },
    showPageMarkers: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    tilesInView () {
      const tiles = this.tiles || []
      return tiles.slice(this.viewPosition, this.viewPosition + this.pageSize)
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
      const tiles = this.tiles || []
      return Math.ceil(tiles.length / this.pageSize)
    }
  },
  methods: {
    style (tile) {
      return `width: ${this.tileWidth}px; height: ${this.tileHeight}px;`
    },
    gridStyle () {
      const gridWidth = (this.tileWidth || 100) * (this.columns || 2)
      const gridHeight = (this.tileHeight || 100) * (this.rows || 2) + (30 * 2)
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
      this.viewPosition = Math.max(0, this.viewPosition - 1)
      this.repeats.previousPage = setTimeout(this.previousPage, 120)
      return false
    },
    nextPage () {
      if (!this.scrollDownDisabled) {
        const maxViewPosition = this.pageSize * (this.maxPages - 1)
        this.viewPosition = Math.min(maxViewPosition, this.viewPosition + 1)
        this.repeats.nextPage = setTimeout(this.nextPage, 120)
      }
      return false
    },
    gotoPage (pageId) {
      this.viewPosition = pageId * this.pageSize
    },
    clearRepeat (key) {
      clearTimeout(this.repeats[key])
    }
  }
}
</script>

<style scoped>
.tile-grid {
  display: flex;
  flex-flow: row wrap;
  margin: auto;
  border-radius: 4px;
}

.scroll-prev {
  border-radius: 4px 4px 0 0;
}

.tile-grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ccc;
  color: #222;
  flex: auto;
}

.tile-grid-item.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ccc;
  color: #999;
}

.scroll-next {
  border-radius: 0 0 4px 4px;
}

.grid-button {
  width: 100%;
  flex: auto;
  height: 30px;
  color: gold;
  background: rgba(140, 5, 5, 0.7);
  font-size: 24px;
  cursor: pointer;
  user-select: none;
}
.grid-button:hover {
  color: lightskyblue;
  background: rgba(0, 0, 0, 0.7);
}
.grid-button:active {
  background: rgba(0, 0, 0, 0.9);
}
.grid-button.disabled {
  color: #999;
  background: #BBB;
  outline: none;
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
