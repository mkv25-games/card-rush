<template>
  <div class="icon">
     <font-awesome-icon :icon="iconOptions" />
  </div>
</template>

<script>
export default {
  props: {
    icon: String
  },
  computed: {
    iconOptions () {
      const icon = this.icon || 'dice'
      return ['fas', icon]
    }
  }
}
</script>

<style scoped>
.icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 1.5em;
  height: 1.5em;
  margin: -0.25em 0;
  text-align: center;
  vertical-align: middle;
  user-select: none;
}
.icon.button {
  border-radius: 50%;
  border: 4px solid rgba(0,0,0,0);
  margin: 0.1em;
  cursor: pointer;
  background: rgba(255,255,255,0.5);
}
.icon.button:hover {
  color: #666;
  border-color: white;
}
.icon.button:active {
  color: black;
  border-color: white;
  background: rgba(0,0,0,0.1)
}

.darkmode .icon.button:hover {
  color: white;
}
</style>
