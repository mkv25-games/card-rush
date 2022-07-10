<template>
  <svg v-if="layout"
    :width="layout.width" :height="layout.height">
    <g>
      <tech-edge v-for="edge in layout.edges" :key="edge.id" :edge="edge" />
    </g>
    <g>
      <world-map-location v-for="location in layout.children" :key="location.id"
        :class="location.className || 'location'"
        :location="location" />
    </g>
  </svg>
</template>

<script>
const ELK = require('elkjs')
const elk = new ELK()

const makeExampleGraph = () => {
  return {
    id: 'world-map',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'spacing.nodeNodeBetweenLayers': 50,
      'elk.direction': 'DOWN'
    },
    children: [
      { id: 'n1', width: 120, height: 60, label: 'Chemistry' },
      { id: 'n2', width: 120, height: 60, label: 'Biology' },
      { id: 'n3', width: 120, height: 60, label: 'Physics' }
    ],
    edges: [
      { id: 'e1', sources: ['n1'], targets: ['n2'] },
      { id: 'e2', sources: ['n1'], targets: ['n3'] }
    ]
  }
}

function removeEmptyEdges (edge) {
  const hasTargets = edge.targets && edge.targets.length > 0
  const hasSources = edge.sources && edge.sources.length > 0
  return hasTargets && hasSources
}

export default {
  data () {
    return {
      layout: {
        children: [],
        edges: []
      },
      graph: {
        type: Object(),
        default: makeExampleGraph
      }
    }
  },
  computed: {
    locations () {
      return this.$store.state.gamedata.Location || []
    }
  },
  async mounted () {
    await this.updateGraph()
    const layout = await this.computeLayout()
    console.log('World Map mounted:', layout)
    this.layout = layout
  },
  methods: {
    async updateGraph () {
      const { locations } = this
      this.graph = makeExampleGraph()
      const children = locations.map((location, index) => {
        return {
          id: `c_${location.id}`,
          width: 80,
          height: 80,
          label: location.name,
          color: location.color,
          icon: location.icon,
          data: location
        }
      })

      const edges = locations.map((loc, i) => {
        const nextLoc = locations[(i + 1) % locations.length]
        const edge = { id: `e_${i}`, sources: [`c_${loc.id}`], targets: [`c_${nextLoc.id}`] }
        return edge
      })

      const portalEdges = locations.map((loc, i) => {
        const portalLoc = locations[(i + 3) % locations.length]
        const edge = { id: `ex_${i}`, sources: [`c_${loc.id}`], targets: [`c_${portalLoc.id}`] }
        return edge
      })

      const evenMoreEdges = locations.map((loc, i) => {
        const portalLoc = locations[(i + 5) % locations.length]
        const edge = { id: `ex_${i}`, sources: [`c_${loc.id}`], targets: [`c_${portalLoc.id}`] }
        return edge
      })
      // { id: 'e1', sources: ['n1'], targets: ['n2'] }

      this.graph.children = children
      this.graph.edges = [].concat(edges, portalEdges, evenMoreEdges) || removeEmptyEdges(edges)
    },
    async computeLayout () {
      let result = {}
      try {
        result = await elk.layout(this.graph)
        console.log('World Map, ELKJS Result:', result)
      } catch (ex) {
        console.error('World Map, ELKJS Error:', ex)
      }
      return result
    }
  }
}
</script>

<style scoped>
svg {
  zoom: 1.0;
}
</style>
