<template>
  <settings class="icon-list">
    <div class="grid-icons">
      <h1>Available Icons</h1>
      <PaginatedItems :items="iconTiles">
        <template v-slot="{ paginatedItems }">
          <Tabulation :items="paginatedItems" />
        </template>
      </PaginatedItems>
    </div>
  </settings>
</template>

<script>
import icons from '@/models/icons'
import Tabulation from '../../../components/ui/Tabulation.vue'

export default {
  computed: {
    iconTiles () {
      return icons().map((icon) => {
        return {
          id: icon,
          icon: icon
        }
      }).filter(item => item.icon)
    }
  },
  components: { Tabulation }
}
</script>

<style scoped>
.grid-icons {
  overflow-y: scroll;
  overflow-x: hidden;
  height: 100%;
}

.icon-filter {
  padding: 0.5em 1.0em;
  border: 2px solid #ccc;
}
</style>
