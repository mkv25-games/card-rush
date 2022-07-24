<template>
  <div class="home cover-image">
    <div class="excerpt">
      <h1>Card Rush</h1>
      <p>Welcome to the Card Rush game.</p>
      <p>In this place, in this space and time, conquest awaits.</p>
      <p>&nbsp;</p>
      <div v-if="$store.state.saveFileList.length > 0">
        <grow-button>
          <a v-on:click="reloadLastSave(lastSaveFile)">Continue <b>{{ lastSaveFile.name }}</b></a>
        </grow-button>
      </div>
      <div v-else>
        <grow-button>
          <router-link to="/main-menu" draggable="false">Begin A New Adventure</router-link>
        </grow-button>
      </div>
      <p>&nbsp;</p>
    </div>
  </div>
</template>

<script>
import commonComputed from '@/utils/commonComputed'
import commonMethods from '@/utils/commonMethods'

export default {
  async mounted () {
    await this.$store.dispatch('refreshSaveFileList')
  },
  computed: Object.assign({}, commonComputed),
  methods: Object.assign({}, commonMethods)
}
</script>

<style scoped>
.home {
  display: flex;
  background-color: #222;
  justify-content: center;
  align-items: center;
}

h1 {
  color: black;
}

.excerpt {
  display: inline-block;
  width: 40%;
  padding: 20px 20px;
  border-radius: 1em;
  border-left: 4px solid #eee;
  border-right: 4px solid #eee;
  background: rgba(224, 224, 224, 0.7);
  color: black;
  font-weight: 500;
}

.cover-image {
  background: url('../../public/assets/icon.png') no-repeat center center;
  background-size: contain;
}
</style>
