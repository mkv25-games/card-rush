<template>
  <div class="mainmenu">
    <h1>Main Menu</h1>

    <div class="column">
      <h2>World Management</h2>
      <p>Options for new and returning players:</p>

      <column>
        <grow-button v-if="lastSaveFile" >
          <a v-on:click="reloadLastSave(lastSaveFile)">Continue <b>{{ lastSaveFile.name }}</b></a>
        </grow-button>
        <grow-button v-else :disabled="true">
          <a>No Recent Save File Found</a>
        </grow-button>

        <grow-button>
          <router-link to="/start-new-game">Start New Game</router-link>
        </grow-button>

        <grow-button v-if="saveFileList.length > 0">
          <router-link to="/save-file-management">Manage Save Files</router-link>
        </grow-button>
        <grow-button v-else :disabled="true">
          <a>Manage Save Files</a>
        </grow-button>
      </column>

    </div>
    <div class="column">
      <h2>Recent Discoveries</h2>
      <h3>Characters</h3>
      <vertical-tile-grid :tiles="characters" :columns="1" :rows="4" :tileWidth="300">
        <template v-slot="{ tile }">
          <div class="icon-label" :style="{ background: tile.color }">
            <span><font-awesome-icon :icon="['fas', tile.icon || 'star']" /></span>
            <label>{{ tile.name }}</label>
          </div>
        </template>
      </vertical-tile-grid>
      <h3>Locations</h3>
      <vertical-tile-grid :tiles="locations" :columns="1" :rows="4" :tileWidth="300">
        <template v-slot="{ tile }">
          <div class="icon-label" :style="{ background: tile.color }">
            <span><font-awesome-icon :icon="['fas', tile.icon || 'star']" /></span>
            <label>{{ tile.name }}</label>
          </div>
        </template>
      </vertical-tile-grid>
    </div>
  </div>
</template>

<script>
import VerticalTileGrid from '../components/ui/VerticalTileGrid.vue'
import commonComputed from '@/utils/commonComputed'
import commonMethods from '@/utils/commonMethods'

export default {
  async mounted () {
    await Promise.all([
      this.$store.dispatch('refreshSaveFileList'),
      this.$store.dispatch('loadModpacks')
    ])
  },
  computed: Object.assign({}, commonComputed),
  methods: Object.assign({}, commonMethods),
  components: { VerticalTileGrid }
}
</script>

<style lang="css" scoped>
.column {
  vertical-align: top;
  display: inline-block;
  width: 48%;
}
.disabled-link {
  opacity: 0.4;
  cursor:default;
}
a {
  color: purple;
  text-decoration: none;
  cursor: pointer;
}
a:hover {
  color: purple;
  text-shadow: 2px 2px rgb(50, 20, 20, 0.2);
}

.icon-label {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  align-items: stretch;
  margin: auto;
  width: 100%;
  font-weight: bold;
}
.icon-label:hover {
  background: #111;
  font-weight: bold;
}
.icon-label:active {
  background: #444;
}
.icon-label > span {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 1;
  min-width: 2em;
  min-height: 2em;
  padding: 0.5em;
}
.icon-label > label {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex: 1 50;
  padding: 0.5em;
}
.icon-label:hover > * {
  background: rgba(255, 255, 255, 0.1);
}
.icon-label:active > * {
  background: rgba(0, 0, 0, 0.1);
}
</style>
