<template>
  <g :transform="`translate(${location.x} ${location.y})`">
    <circle
      :r="hw"
      :cx="hw"
      :cy="hh"
      :fill="location.color || 'gray'" />
    <text
      fill="black" stroke="none"
      font-family="Avenir, Helvetica, Arial, sans-serif"
      :y="5"
      font-size="15"
      text-anchor="middle">
    </text>
    <foreignObject class="node" x="0" y="0" :width="width" :height="height">
      <body xmlns="http://www.w3.org/1999/xhtml" class="locationbox html">
        <div>
          <Icon :icon="findIcon(location)" />
          <div v-for="(line, index) in labelLines" :key="`la_${index}`">{{ line }}</div>
        </div>
      </body>
    </foreignObject>
  </g>
</template>

<script>
export default {
  props: {
    location: {
      type: Object,
      default () {
        return { label: 'No label' }
      }
    }
  },
  methods: {
    findIcon (location) {
      const { data } = location
      return data ? data.icon || 'seedling' : location.icon || 'seedling'
    }
  },
  computed: {
    width () {
      return this.location.width || 100
    },
    height () {
      return this.location.height || 100
    },
    hw () {
      return this.width / 2
    },
    hh () {
      return this.height / 2
    },
    labelLines () {
      const label = this.location.label || 'No label'
      return label.split(' ')
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
