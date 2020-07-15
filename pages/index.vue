<template>
  <v-layout column justify-center align-center class="h-full">
    <v-flex class="md:w-2/3 lg:w-1/2 h-full flex-col">
      <section class="flex flex-col overflow-y-scroll h-0">
        <template v-for="(talk, index) in talks">
          <balloon :key="index" :talk="talk" />
        </template>
        <div id="bottom" />
      </section>
      <section class="inline-flex w-full">
        <v-text-field
          v-model="message"
          placeholder="メッセージを入力してください"
          solo
          dense
        ></v-text-field>
        <v-btn class="mx-4" :disabled="!isSendButton" @click="send">送信</v-btn>
        <v-btn @click="reset">リセット</v-btn>
      </section>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Balloon from '~/components/Balloons/balloon.vue'

interface ITalk {
  message: string
  isSelf: boolean
  isProcessing: boolean
}

interface ITalkAPIRequest {
  message: string
}

interface ITalkAPIResult {
  perplexity: number
  reply: string
}

interface ITalkAPIResponse {
  status: number
  message: string
  results: ITalkAPIResult[]
}

@Component({
  components: { Balloon },
})
export default class Index extends Vue {
  talks: ITalk[] = []
  isProcessing: boolean = false
  message: string = ''
  readonly url: string =
    'https://us-central1-chatbot-by-talkapi-nuxt.cloudfunctions.net/talkapi'

  send() {
    const message = this.message
    this.talks.push({ message, isSelf: true, isProcessing: false })
    this.saveTalks(this.talks)

    const talk: ITalk = { message: '', isSelf: false, isProcessing: true }
    this.talks.push(talk)
    this.apiCall(talk, message)
    this.message = ''
    this.scrollBottom()
  }

  async apiCall(talk: ITalk, message: string) {
    this.isProcessing = true
    const data: ITalkAPIRequest = { message }
    const response: ITalkAPIResponse = await this.$axios
      .$post(this.url, data)
      .catch((e) => e)

    talk.isProcessing = false
    this.isProcessing = false
    if (!response.results) {
      talk.message = 'よくわからなかった！！！'
      this.saveTalks(this.talks)
      return
    }

    talk.message = response.results[0].reply
    this.saveTalks(this.talks)
  }

  saveTalks(talks: ITalk[]) {
    localStorage.setItem('talks', JSON.stringify(talks))
  }

  get isSendButton() {
    return !this.isProcessing && this.message
  }

  reset() {
    this.talks = []
    this.saveTalks(this.talks)
  }

  scrollBottom() {
    // スクロール
    setTimeout(() => {
      document.getElementById('bottom')!.scrollIntoView(true)
    }, 0.1)
  }

  mounted() {
    const talks = localStorage.getItem('talks')

    if (talks) {
      try {
        this.talks = JSON.parse(talks).filter(
          (talk: ITalk) => !talk.isProcessing
        )
      } catch (error) {
        console.warn('localStorage Parse Error.')
      }
    }

    if (!this.talks.length) {
      this.talks = [
        { message: '雑談しよう！', isSelf: false, isProcessing: false },
      ]
      this.saveTalks(this.talks)
    }
    this.isProcessing = false
    this.scrollBottom()
  }
}
</script>
