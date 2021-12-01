<template>
  <v-card>
    <v-card-title>
      <v-icon class="mr-3">mdi-shopping</v-icon>
      Purchase Item
      <v-spacer></v-spacer>
      <v-btn text outlined @click="$router.push('/' + upc)">
        <v-icon class="mr-1">mdi-chevron-left</v-icon>
        Back
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-form v-model="valid">
        <div class="text-center" v-if="!itemDetails || loading"><v-progress-circular indeterminate></v-progress-circular></div>
        <v-alert type="error" v-else-if="!itemExists">The item with the supplied UPC does not exist</v-alert>
        <v-alert type="error" v-else-if="!isDistributor">You must be a consumer in order to purchase items!</v-alert>
        <v-alert type="error" v-else-if="itemDetails.itemState < 6">The item has not been received by a reseller yet!</v-alert>
        <v-alert type="error" v-else-if="itemDetails.itemState > 6">The item has already been purchased!</v-alert>
        <template v-else>
          <ProductDetails :item="itemDetails" />
          <v-sheet :elevation="5">
            <v-container class="mt-5">
              <v-row no-gutters>
                <v-col cols="12" class="text-center">
                  Price:<br />
                  <span class="title">{{ priceInEth }} ETH</span>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="text-center">
                  <v-btn :disabled="!valid" x-large color="success" @click="purchaseItem">
                    <v-icon class="mr-3">mdi-shopping</v-icon>
                    Purchase Item
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-sheet>
        </template>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import ProductDetails from "./ProductDetails";
import itemDetails from "../mixins/item-details";
import roles from "../mixins/roles";
import { mapState } from "vuex";

export default {
  mixins: [itemDetails, roles],
  components: {
    ProductDetails
  },

  data() {
    return {
      loading: false,
      valid: false
    }
  },

  computed: {
    ...mapState(["eth", "account"]),
    priceInEth() {
      if(!this.itemDetails) {
        return '';
      }

      return this.eth.web3.utils.fromWei(this.itemDetails.consumerPrice);
    }
  },

  methods: {
    async purchaseItem() {
      this.loading = true;
      try {
        await this.eth.instance.purchaseItem(
          this.upc,
          { from: this.account.address, value: this.itemDetails.consumerPrice }
        );
        this.$router.push(`/${this.upc}`);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
