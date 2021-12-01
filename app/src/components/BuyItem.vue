<template>
  <v-card>
    <v-card-title>
      <v-icon class="mr-3">mdi-basket</v-icon>
      Buy Item
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
        <v-alert type="error" v-else-if="!isDistributor">You must be a distributor in order to buy items!</v-alert>
        <v-alert type="error" v-else-if="itemDetails.itemState < 3">The item has not been put up for sale yet!</v-alert>
        <v-alert type="error" v-else-if="itemDetails.itemState > 3">The item has already been bought!</v-alert>
        <template v-else>
          <ProductDetails :item="itemDetails" />
          <v-sheet :elevation="5">
            <v-container class="mt-5">
              <v-row no-gutters>
                <v-col cols="12" class="text-center">
                  Price:<br />
                  <span class="title">{{ priceInEth }} ETH</span>
                </v-col>
                <v-col cols="12">
                  <v-text-field :rules="[isNumeric, isRequired]" prepend-inner-icon="mdi-currency-usd" hint="The new price for the item for retailers in ETH" label="Retailer Price [ETH]" v-model="price"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="text-center">
                  <v-btn :disabled="!valid" x-large color="success" @click="buyItem">
                    <v-icon class="mr-3">mdi-basket</v-icon>
                    Buy Item
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
      price: '',
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

      return this.eth.web3.utils.fromWei(this.itemDetails.productPrice);
    },
    priceInWei() {
      if(!this.price) {
        return 0;
      }

      return this.eth.web3.utils.toWei(this.price);
    }
  },

  methods: {
    isRequired(str) {
      return !!str || "This field is required!";
    },
    isNumeric(str) {
      if(
          !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
          !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
      ) {
        return true;
      }

      return "Value must be numeric!";
    },
    async buyItem() {
      this.loading = true;
      try {
        await this.eth.instance.buyItem(
          this.upc, 
          this.priceInWei,
          { from: this.account.address, value: this.itemDetails.productPrice }
        );
        this.$router.push(`/${this.upc}`);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
