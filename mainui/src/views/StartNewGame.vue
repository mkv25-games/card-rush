<template>
  <div class="start-new-game">
    <pan-and-zoom class="darkmode" :show-labels="false" :min-zoom="1" :max-zoom="1">
      <world-map :world="previewWorld" :show-icons="previewWorld.size < 10" class="preview-world"></world-map>
    </pan-and-zoom>
    <lightbox v-if="showDialog">
      <h2>Create new world</h2>
      <div class="form">
        <div class="form-row">
          <input v-model="filename" placeholder="Enter text" />
          <button v-on:click="pickRandomName"><icon icon="dice" /></button>
        </div>
        <div class="form-row">
          <button v-for="world in worlds" :key="world.id" :class="selectedWorldClass(world)" v-on:click="selectedWorld = world">{{ world.name }}</button>
        </div>
        <div v-if="formErrors.length" class="form-errors">
          <h3>Can't create world</h3>
          <p class="form-error" v-for="message in formErrors" :key="message">{{ message }}</p>
        </div>
        <p class="actions">
          <router-link to="/"><icon icon="window-close" /><label>Cancel</label></router-link>
          <button v-on:click="submitForm"><icon icon="pen" /><label>Create</label></button>
          <button v-on:click="showDialog = false"><icon icon="map-marked-alt" /><label>Preview</label></button>
        </p>
      </div>
    </lightbox>
    <p v-else class="actions show-dialog-button">
      <button v-on:click="showDialog = true"><icon icon="map-marked-alt" /><label>Hide</label></button>
    </p>
  </div>
</template>

<script>
import newSaveFile from '@/models/saveFile'
import clone from '@/utils/clone'

export default {
  data () {
    return {
      filename: 'Card Rush',
      formErrors: [],
      showDialog: true,
      selectedWorld: {}
    }
  },
  computed: {
    electron () {
      return window.electron
    },
    saveFile () {
      return this.$store.state.saveFile
    },
    worlds () {
      const worlds = this.$store.state.gamedata.World || []
      return worlds.sort((a, b) => {
        return a.size < b.size ? -1 : 1
      })
    },
    previewWorld () {
      const previewName = this.filename
      const world = clone(this.selectedWorld)
      world.name = previewName
      return world
    }
  },
  mounted () {
    this.pickRandomName()
    this.selectedWorld = this.worlds.filter(n => n.default)[0] || this.worlds[0] || { size: 0 }
  },
  methods: {
    selectedWorldClass (world) {
      if (world.id === this.selectedWorld.id) {
        return 'selected'
      }
      return ''
    },
    validateForm () {
      this.formErrors = []
      if (!this.filename) {
        this.formErrors.push('No world name chosen')
      }

      if (!this.selectedWorld || !this.selectedWorld.size) {
        this.formErrors.push('World size is too small!')
      }

      return this.formErrors.length === 0
    },
    pickRandomName () {
      const world = this.$store.state.gamedata.WorldNames[0] || { names: ['Random World Names'] }
      const worldNames = world.names.split(' ').map(n => n.trim())
      const index1 = Math.floor(Math.random() * worldNames.length)
      const index2 = Math.floor(Math.random() * worldNames.length)
      this.filename = [worldNames[index1 % worldNames.length], worldNames[index2 % worldNames.length]].join(' ')
    },
    submitForm () {
      return this.validateForm() ? this.createNewGameFile(this.previewWorld) : false
    },
    async createNewGameFile (previewWorld) {
      console.log('Creating new game file:', previewWorld.name)
      let saveFile
      try {
        saveFile = newSaveFile({
          name: previewWorld.name,
          world: previewWorld
        })
        await this.$store.dispatch('saveGameRecord', saveFile)
        await this.$store.dispatch('loadGameRecord', saveFile)
        this.$router.push({ path: '/overview' })
      } catch (ex) {
        this.formErrors.push('Unable to create save file:', ex.message, saveFile)
        console.log('[StartNewGame.vue]', ex, 'Save File:', saveFile)
      }
      return true
    }
  }
}
</script>

<style scoped>
div.start-new-game {
  position: relative;
}
div.form {
  display: inline-block;
  width: 100%;
}
div.form-row {
  display: flex;
  align-items: center;
}
div.form-row > label {
  flex: 1 1;
  text-align: right;
  margin: 0.5em;
}
div.form-row > input {
  flex: 1 1;
}
p.actions {
  display: flex;
  justify-content: center;
}
p.actions > * {
  flex: 0 1;
  margin: 0.5em;
}
p.actions > button, p.actions > a, button, input {
  border: 1px solid black;
  border-radius: 0.4em;
  color: black;
  background: white;
  margin: 0.2em;
  padding: 0.4em 1.2em;
  font-size: 0.9em;
  text-decoration: none;
  font-family: inherit;
  cursor: default;
}
p.actions > button:hover, p.actions > a:hover, button:hover, input:focus, button.selected {
  background: rgb(248, 187, 102);
}
p.actions > button:active, p.actions > a:active, button:active {
  background: rgb(218, 131, 32);
}
button > .icon {
  font-size: 1.2em;
  margin: -0.2em -0.5em;
}
.preview-world {
  max-height: 50vh;
  margin: 1em;
  min-height: 200vh;
  min-width: 200vw;
  font-size: 16px;
}
.show-dialog-button {
  position: absolute;
  top: 1em;
  right: 1em;
}
</style>
