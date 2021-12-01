<template>
  <v-card>
    <v-card-title>
      <v-icon class="mr-3">mdi-coffee</v-icon> Coffee Bean Supply Chain
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row justify="center">
          <v-col cols="12">
            <v-text-field clearable prepend-inner-icon="mdi-barcode-scan" hint="Universal Product Code" label="UPC" v-model="upc"></v-text-field>
          </v-col>
          <v-col cols="12" class="text-center">
            <v-btn :disabled="!upc" x-large color="primary" @click="track">
              <v-icon class="mr-3">mdi-radar</v-icon>
              Track
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  data() {
    return {
      upc: ""
    }
  },

  methods: {
    track() {
      if(this.upc) {
        this.$router.push(this.upc);
      }
    }
  }
}
</script>