<template>
  <g :class="className">
    <g :transform="`translate(${location.x} ${location.y * 0.32})`">
      <polygon v-if="showIcon" :points="polyHexPoints" :fill="color" stroke="#967969" stroke-width="3" />
      <text
        fill="black" stroke="none"
        font-family="Avenir, Helvetica, Arial, sans-serif"
        :y="5"
        font-size="15"
        text-anchor="middle">
      </text>
      <foreignObject class="node" :x="-hw" :y="-hh" :width="width" :height="height">
        <body xmlns="http://www.w3.org/1999/xhtml" class="locationbox html">
          <div>
            <div class="tileImage" :style="tileImageStyle"></div>
            <icon v-if="showIcon" :icon="findIcon(location)" />
            <div v-for="(line, index) in labelLines" :key="`la_${index}`">{{ line }}</div>
          </div>
        </body>
      </foreignObject>
    </g>
  </g>
</template>

<script>
import { Hex } from '@/utils/hex'
import { createScreenLayout } from '@/utils/hexLayout.js'

const centerHex = new Hex(0, 0, 0)

export default {
  props: {
    location: {
      type: Object,
      default () {
        return { label: 'No label' }
      }
    },
    showIcon: {
      type: Boolean,
      default: false
    },
    showLabel: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    findIcon (location) {
      const data = location.data || {}
      return data.icon || location.icon || 'seedling'
    }
  },
  computed: {
    className () {
      const { outOfBounds } = this
      const { animationState } = this.location
      const oobClass = outOfBounds ? 'out-of-bounds' : 'in-bounds'
      return ['wml', animationState || 'hidden', oobClass].join(' ')
    },
    width () {
      return this.location.width || 100
    },
    height () {
      return this.location.height || 100
    },
    hexRadius () {
      return this.width * 0.4
    },
    hw () {
      return this.width / 2
    },
    hh () {
      return this.height / 2
    },
    labelLines () {
      if (!this.showLabel) {
        return []
      }
      const label = this.location.label || 'No label'
      const { hex } = this.location
      const showHexLabel = false
      if (hex && showHexLabel) {
        return [[hex.q, hex.r, hex.s].join(', ')]
      }
      return label.split(' ')
    },
    color () {
      return this.location.color || 'grey'
    },
    polyHexPoints () {
      const hexLayout = createScreenLayout(this.width * 0.95)
      const points = hexLayout.polygonCorners(centerHex)
      return points.map(p => [p.x, p.y].join(' ')).join(',')
    },
    outOfBounds () {
      return this.location.data.id === 'out-of-bounds'
    },
    tileImage () {
      const { $store, location } = this
      return $store.findImageURL(location.image || 'tile-assets-darkened.png')
    },
    tileImageStyle () {
      const { tileImage, location } = this
      const tileSize = -128
      if (location.data.tile) {
        const { row, column } = location.data.tile || { row: 0, column: 0 }
        const xpos = tileSize * column
        const ypos = tileSize * row
        return {
          backgroundImage: `url(${tileImage})`,
          backgroundPosition: [xpos, ypos].map(n => `${n}px`).join(' ')
        }
      } else {
        return {}
      }
    },
    zIndex () {
      const { location } = this
      return Math.round(location.y * 1000)
    }
  }
}
</script>

<style scoped>
foreignObject {
  pointer-events: none;
}
.wml {
  cursor: default;
  user-select: none;
}
.locationbox.html {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.locationbox.html > div.icon {
  font-size: 1.5em;
}
.wml > g > polygon {
  transition: stroke 100ms ease-out;
}
.wml.in-bounds:hover > g > polygon {
  stroke: white;
}
.wml.out-of-bounds {
  opacity: 0.4;
}
.visible {
  transform: translateY(0);
  transition: transform 250ms ease-in, color 500ms ease-in;
  color: black;
}
.visible > g > polygon {
  fill-opacity: 1.0;
  stroke-opacity: 1.0;
  transition: fill-opacity 1500ms, stroke-opacity 1500ms ease-out;
}
.showing {
  transform: translateY(0);
  color: rgba(0,0,0,0);
}
.showing > g > polygon {
  fill-opacity: 0.0;
  stroke-opacity: 0.0;
  transition: fill-opacity 1500ms, stroke-opacity 1500ms ease-out;
}
.hidden {
  visibility: hidden;
}
.hidden > g > polygon {
  fill-opacity: 0.0;
  stroke-opacity: 0.0;
}
.tileImage {
  position: absolute;
  top: 0;
  left: 0;
  width: 128px;
  height: 128px;
  overflow: hidden;
  background-size: 1024px 1024px;
}
</style>
