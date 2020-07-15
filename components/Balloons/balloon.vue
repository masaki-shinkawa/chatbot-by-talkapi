<template>
  <div :class="className">
    <div class="faceicon">
      <img src="~/assets/image/icon/botIcon.png" />
    </div>
    <div class="chatting">
      <div class="says">
        <template v-if="talk.isProcessing">
          <v-progress-circular indeterminate color="primary" />
        </template>
        <template v-if="!talk.isProcessing">
          <p>{{ talk.message }}</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

interface ITalk {
  message: string
  isSelf: boolean
  isProcessing: boolean
}

@Component
export default class Balloon extends Vue {
  @Prop({ type: Object, required: true })
  talk!: ITalk

  get className() {
    return {
      balloon: true,
      user: this.talk.isSelf,
      bot: !this.talk.isSelf,
    }
  }
}
</script>

<style lang="scss" scoped>
.balloon {
  width: 100%;
  margin: 0.5em 0;

  .chatting {
    width: 100%;

    .says {
      display: inline-block;
      position: relative;
      border-radius: 12px;

      &::after {
        content: '';
        display: inline-block;
        position: absolute;
      }

      p {
        margin: 0;
        padding: 0;
      }
    }
  }
}

.bot {
  .faceicon {
    float: left;
    margin-right: -90px;
    width: 80px;

    img {
      width: 100%;
      height: auto;
      border: solid 3px #d7ebfe;
      border-radius: 50%;
    }
  }

  .chatting {
    .says {
      margin: 5px 0 0 105px;
      padding: 17px 13px;
      background: #d7ebfe;

      &::after {
        top: 10px;
        left: -24px;
        border: 12px solid transparent;
        border-right: 12px solid #d7ebfe;
      }
    }
  }
}

.user {
  .faceicon {
    display: none;
  }

  .chatting {
    display: flex;
    flex-direction: row-reverse;

    .says {
      margin: 5px 15px 0 0;
      padding: 17px 13px;
      background: #b5f992;

      &::after {
        top: 10px;
        right: -24px;
        transform: rotate(180deg);
        border: 12px solid transparent;
        border-right: 12px solid #b5f992;
      }
    }
  }
}
</style>
