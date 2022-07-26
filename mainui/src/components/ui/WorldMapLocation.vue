<template>
  <g :class="className">
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
      const { animationState } = this.location
      return ['wml', animationState || 'hidden'].join(' ')
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
.wml:hover > g > polygon {
  stroke: white;
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
</style>
