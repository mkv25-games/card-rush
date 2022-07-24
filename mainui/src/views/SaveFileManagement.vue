<template>
  <div class="save-file-management">
    <h1>Manage Save Files</h1>
    <lightbox v-if="deleteConfirmation">
      <h2>Are you sure you want to delete {{ deleteConfirmation }}?</h2>
      <p v-if="deleteError">{{ deleteError }}</p>
      <form-actions>
        <form-button v-on:click="deleteConfirmation = ''" icon="angle-double-left" label="No - Cancel" />
        <form-button v-on:click="deleteSaveFile(deleteConfirmation)" icon="window-close"  label="Yes - Delete" />
      </form-actions>
    </lightbox>
    <p v-if="loading">Loading Save Data...</p>
    <div v-else-if="saveFiles.length">
      <p>You can load up, or delete save files from this list.</p>
      <paginated-items :items="saveFiles" :page-size="10" item-type-plural="worlds">
        <template #default="{ paginatedItems }">
          <ul>
            <li v-for="saveFile in paginatedItems" :key="saveFile.filepath">
              <div class="name-label" v-on:click="loadGameRecord(saveFile)">{{ saveFile.name }}</div>
              <div class="date-label">{{ formatDate(saveFile.fileinfo.mtime) }}</div>
              <div class="delete-label" v-on:click="showDeleteConfirmation(saveFile.name)"><icon icon="window-close" /></div>
            </li>
          </ul>
        </template>
      </paginated-items>
    </div>
    <div v-else>
      <p>No worlds found.</p>
      <grow-button>
        <router-link to="/start-new-game">Start New Game</router-link>
      </grow-button>
    </div>
    <p>Not what you're looking for?</p>
    <grow-button>
      <router-link to="/overview">&lt; Back</router-link>
    </grow-button>
    <div v-if="errors.length > 0" class="errors">
      <h2>Errors</h2>
      <p v-for="error in errors" :key="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import formatDate from '@/formatting/formatDate'
import listSaveFiles from '@/formatting/listSaveFiles'
// const exampleSaveFiles = [{ name: 'Loading saveFiles', fileinfo: { mtime: new Date() }, filepath: '/' }]

export default {
  data () {
    return {
      errors: [],
      deleteConfirmation: '',
      loading: true
    }
  },
  computed: {
    electron () {
      return window.electron
    },
    saveFiles () {
      return listSaveFiles(this.$store.state.saveFileList)
    }
  },
  methods: {
    async loadGameRecord (savefile) {
      try {
        await this.$store.dispatch('loadGameRecord', savefile)
        this.$router.push({ path: '/overview' })
      } catch (ex) {
        this.errors.push(`Unable to load savefile ${savefile.filepath}.`)
      }
    },
    async deleteSaveFile (key) {
      try {
        await this.electron.clearData(key)
        this.deleteConfirmation = ''
        this.deleteError = ''
      } catch (ex) {
        this.deleteError = `Unable to delete file: ${ex.message}`
      }
      return this.findSaveFiles()
    },
    async findSaveFiles () {
      this.loading = true
      await this.$store.dispatch('refreshSaveFileList')
      this.loading = false
    },
    showDeleteConfirmation (savefileName) {
      this.deleteConfirmation = savefileName
    },
    formatDate
  },
  async mounted () {
    this.findSaveFiles()
  }
}
</script>

<style scoped>
.paginated-items {
  width: 60%;
}
ul {
  margin: 0;
  padding: 0;
  display: inline-block;
  padding: 5px 0;
  border-radius: 10px;
  border-left: 4px solid plum;
  border-right: 4px solid plum;
  background: rgba(60, 60, 60, 0.7);
}
li {
  display: flex;
  margin: 4px;
  list-style: none;
  color: white;
}
li > div {
  display: inline-block;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 5px;
}
li > div.name-label {
  margin-left: 0;
}
li > div.delete-label {
  margin-right: 0;
}
li:hover > div.name-label:hover {
  color: lightblue;
  background: #333;
}
li:hover > div.delete-label:hover {
  color: #FAA;
  background: #533;
}
li > div.name-label {
  color: gold;
  font-weight: 700;
  text-align: left;
  flex: 1 1;
  margin-right: 4px;
  text-transform: uppercase;
}
</style>
