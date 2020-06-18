<template>
  <div id="control">
    <button class="btn" @click="remotePushBtn">リモートへえ</button>


    <div>peerid: {{ myPeerId }}</div>
    <form @submit.prevent="connectPeer">
        <input type="text" v-model="$store.state.connectPeerId"/>
        <button type="submit">connectPeer</button>
    </form>
    <pre>{{ $store.state }}</pre>

    <router-link to="/hee">へえボタン</router-link>
  </div>
</template>

<script>
export default {
  name: 'Hee',
  data() {
    return {
    }
  },
  computed: {
    count() {
      return this.$store.state.count
    },
    max() {
      return this.$store.state.max
    },
    myPeerId() {
      return this.$store.state.myPeerId
    },
    connectPeerId() {
      return this.$store.state.connectPeerId
    },
  },
  mounted() {
    this.$store.state.myPeerId = this.$peer.id
  },
  methods: {
    connectPeer() {
      const id = this.connectPeerId
      const conn = this.$peer.connect(id)
      const addCount = this.addCount

      console.log(this.$peer);
      conn.on('open', function() {
        console.log("connect")
      })
      this.$peer.on('connection', function(conn) {
        conn.on('data', function(data){
          if(data == "push") {
            console.log("remote hee")
            addCount()
          }
        });
      })
    },
    remotePushBtn() {
      const id = this.connectPeerId
      const conn = this.$peer.connect(id)
      conn.on('open', function() {
        conn.send('push');
      })
    },
    addCount() {
      if (this.$store.state.count < this.$store.state.max) {
        this.$store.state.count += 1
      }
    },
    resetCount() {
      this.$store.state.count = 0
    }
  },
}
</script>

<style lang="scss">
#control {
}
</style>