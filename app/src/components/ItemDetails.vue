<template>
  <div>
    <v-card>
      <v-card-title>
        <v-icon class="mr-3">mdi-coffee</v-icon>
        Item Details
        <v-spacer></v-spacer>
        <v-btn text outlined @click="$router.push('/')">
          <v-icon class="mr-1">mdi-chevron-left</v-icon>
          Back
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div class="text-center" v-if="!itemExists && !itemDetails"><v-progress-circular indeterminate></v-progress-circular></div>
        <v-alert type="warning" v-else-if="!itemExists">
          The item could not be found!
        </v-alert>
        <ProductDetails v-else :item="itemDetails" />
        <v-container v-if="itemDetails && !itemExists && isFarmer">
          <v-row>
            <v-col cols="12" class="text-center">
              <v-btn x-large color="success" @click="$router.push(`/${upc}/harvest`)">
                <v-icon class="mr-3">mdi-feather</v-icon>
                Harvest Item
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
    <v-card v-if="itemExists" class="mt-3">
      <v-card-title>
        <v-icon class="mr-3">mdi-store-search</v-icon>
        Supply Chain Tracking
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <SupplyChain :item="itemDetails" :loading="loading" @action-triggered="reload"></SupplyChain>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SupplyChain from "./SupplyChain";
import ProductDetails from "./ProductDetails.vue";
import itemDetails from "../mixins/item-details";
import roles from "../mixins/roles";

export default {
  mixins: [itemDetails, roles],
  components: {
    SupplyChain,
    ProductDetails
  },

  data() {
    return {
      loading: false
    }
  },

  computed: {
    ...mapState(["account", "eth"]),
    isFarmer() {
      return this.account.farmer === true;
    }
  },

  methods: {
    async reload() {
      this.loading = true;
      try {
        await this.loadItemDetails(this.upc);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
