<template>
  <div id="control">
    <div class="control">
      <div class="remote">
        <div class="center">コントローラーにする</div>
        <div class="center">
          <div class="status"><span v-if="success">接続成功</span><span v-if="!success">接続中…</span></div>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col">
          <div class="border border-dark rounded py-2">
            <div class="text-center">
              <img width="50px" src="@/assets/sticker/taiyaki.png" alt="">
            </div>
            <div class="d-flex flex-column">
              <button class="btn" @click="startSticker('taiyaki', 100)">100</button>
              <button class="btn" @click="startSticker('taiyaki', 75)">75</button>
              <button class="btn" @click="startSticker('taiyaki', 50)">50</button>
              <button class="btn" @click="startSticker('taiyaki', 25)">25</button>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="border border-dark rounded py-2">
            <div class="text-center">
              <img width="50px" src="@/assets/sticker/omanju.png" alt="">
            </div>
            <div class="d-flex flex-column">
              <button class="btn" @click="startSticker('omanju', 100)">100</button>
              <button class="btn" @click="startSticker('omanju', 75)">75</button>
              <button class="btn" @click="startSticker('omanju', 50)">50</button>
              <button class="btn" @click="startSticker('omanju', 25)">25</button>
            </div>
          </div>
        </div>
      </div>
      <button class="btn" @click="resetCount">リセット</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hee',
  data() {
    return {
      success: false,
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
    const setMyPeerId = this.setMyPeerId
    const connectPeer = this.connectPeer
    this.$peer.on('open', function() {
      setMyPeerId()
      connectPeer()
    })
  },
  methods: {
    setMyPeerId() {
      this.$store.state.myPeerId = this.$peer.id
    },
    connectPeer() {
      const id = this.$route.params.id
      const conn = this.$peer.connect(id)
      const successConnection = this.successConnection
      conn.on('open', function() {
        successConnection()
      })
    },
    successConnection() {
      this.peers()
      this.success = true
    },
    peers() {
      for (let [key] of Object.entries(this.$peer.connections)) {
        this.$store.state.connectPeerId.push(key);
      }
    },
    startSticker(sticker, percentage) {
      const id = this.connectPeerId[0]
      const conn = this.$peer.connect(id)
      conn.on('open', function() {
        conn.send({
          action: 'sticker',
          option: {
            sticker: sticker,
            percentage: percentage,
          }
        });
      })
    },
    resetCount() {
      const id = this.connectPeerId[0]
      const conn = this.$peer.connect(id)
      conn.on('open', function() {
        conn.send({
          action: 'reset'
        });
      })
    },
  },
}
</script>

<style lang="scss">
body {
  background: #efefef;
}

#control {
  .control {
    position: relative;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .btn {
      margin: 10px;
      width: 200px;
      font-size: 2em;
      background: #ffffff;
      box-shadow:2px 2px 9px -2px #969696;
      border-radius:6px;
      border:1px solid #cccccc;
      color: inherit;
      text-decoration: none;
    }
    .remote {
      margin-top: 10px;
      padding: 10px;
      width: 200px;
      box-sizing: border-box;
      background: #ff9bcd;
      box-shadow:2px 2px 9px -2px #969696;
      border-radius:6px;
      border:1px solid #cccccc;
      color: inherit;
      text-decoration: none;
      word-wrap: break-word;
      .status {
        background: #ffffff;
        border-radius:6px;
        border:1px solid #cccccc;
        padding: 10px;
      }
    }
  }
}
</style>