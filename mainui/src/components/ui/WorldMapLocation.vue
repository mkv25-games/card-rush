<template>
  <g :transform="`translate(${location.x} ${location.y})`">
    <polygon :points="polyHexPoints" :fill="color" stroke="#967969" stroke-width="3" />
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
          <icon v-if="showIcon" :icon="findIcon(location)" />
          <div v-for="(line, index) in labelLines" :key="`la_${index}`">{{ line }}</div>
        </div>
      </body>
    </foreignObject>
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
    }
  },
  methods: {
    findIcon (location) {
      const data = location.data || {}
      return data.icon || location.icon || 'seedling'
    }
  },
  computed: {
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
    }
  }
}
</script>

<style scoped>
.locationbox.html {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.locationbox.html > div.icon {
  font-size: 1.5em;
}
</style>
