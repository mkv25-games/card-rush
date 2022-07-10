<template>
  <g :transform="`translate(${location.x} ${location.y})`">
    <circle
      :r="location.width / 2"
      :cx="location.width / 2"
      :cy="location.height/ 2"
      :fill="location.color || 'gray'" />
    <text
      fill="black" stroke="none"
      font-family="Avenir, Helvetica, Arial, sans-serif"
      :y="5"
      font-size="15"
      text-anchor="middle">
    </text>
    <foreignObject class="node" x="0" y="0" :width="location.width" :height="location.height">
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
    hw () {
      return (this.location.width || 0) / 2
    },
    hh () {
      return (this.location.height || 0) / 2
    },
    labelLines () {
      return this.location.label.split(' ')
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
