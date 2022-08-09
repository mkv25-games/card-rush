<template>
  <div class="start-new-game">
    <pan-and-zoom class="darkmode" :show-labels="false" :min-zoom="1" :max-zoom="1">
      <world-map :world="previewWorld"
        :show-icons="previewWorld.size < 10"
        :show-labels="false"
        :show-images="true"
        class="preview-world" />
    </pan-and-zoom>
    <lightbox v-if="showDialog">
      <h2>Create new world</h2>
      <div class="form">
        <form-row>
          <form-input v-model="filename" placeholder="Name your world" :validator="validateFilename" />
          <form-button v-on:click="pickRandomName" icon="dice" />
        </form-row>
        <form-row>
          <form-button v-for="world in worlds" :key="world.id" :class="selectedWorldClass(world)" v-on:click="selectedWorld = world">{{ world.name }}</form-button>
        </form-row>
        <div v-if="formErrors.length" class="form-errors">
          <h3>Can't create world</h3>
          <p class="form-error" v-for="message in formErrors" :key="message">{{ message }}</p>
        </div>
        <form-actions>
          <form-button to="/" icon="window-close" label="Cancel" />
          <form-button v-on:click="submitForm" icon="pen" label="Create" />
          <form-button v-on:click="showDialog = false" icon="map-marked-alt" label="Preview" />
        </form-actions>
      </div>
    </lightbox>
    <p v-else class="actions show-dialog-button">
      <form-button v-on:click="showDialog = true" icon="map-marked-alt" label="Hide" />
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
    validateClass (fn) {
      const errors = fn()
      return errors.length ? 'no-ok' : 'ok'
    },
    validateFilename () {
      const { filename } = this
      const formErrors = []
      if (!filename) {
        formErrors.push('No world name chosen')
      }
      if (filename && filename.length > 30) {
        formErrors.push('World name is too long; max 30 characters.')
      }
      return formErrors
    },
    validateWorldSize () {
      const { selectedWorld } = this
      const formErrors = []
      if (!selectedWorld || !selectedWorld.size) {
        formErrors.push('World size is too small!')
      }
      return formErrors
    },
    validateForm () {
      const { validateFilename, validateWorldSize } = this
      const validators = [validateFilename, validateWorldSize]
      this.formErrors = validators.map(validator => validator()).flat()
      return this.formErrors.length === 0
    },
    pickRandomName () {
      const gameDataWorldNames = this.$store.state.gamedata.WorldNames || [{ names: 'Random World Names' }]
      const worldNames = gameDataWorldNames.map(wn => {
        const names = wn.names || ''
        return names.split(' ')
      }).flat(1)
        .map(n => n.trim())
        .filter(n => n)
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
        this.$router.push({ path: '/world/map' })
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
