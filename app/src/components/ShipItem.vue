<template>
  <v-card>
    <v-card-title>
      <v-icon class="mr-3">mdi-truck</v-icon>
      Ship Item
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
        <v-alert type="error" v-else-if="!isDistributor">You must be a distributor in order to ship items!</v-alert>
        <v-alert type="error" v-else-if="itemDetails.itemState < 4">The item has not been sold yet!</v-alert>
        <v-alert type="error" v-else-if="itemDetails.itemState > 4">The item has already been shipped!</v-alert>
        <v-alert type="error" v-else-if="!itemOwner">You are not the owner of the item!</v-alert>
        <template v-else>
          <ProductDetails :item="itemDetails" />
          <v-sheet :elevation="5">
            <v-container class="mt-5">
              <v-row no-gutters>
                <v-col cols="12">
                  <v-text-field :error-messages="addressErrorState" :rules="[isRequired, isAddress]" prepend-inner-icon="mdi-map-marker" hint="The address of the receiving retailer" label="Retailer Address" v-model="retailerAddress"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" class="text-center">
                  <v-btn :loading="validating" :disabled="!valid" x-large color="success" @click="shipItem">
                    <v-icon class="mr-3">mdi-truck</v-icon>
                    Ship Item
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

  created() {
    this.timeout = null;
  },

  data() {
    return {
      retailerAddress: '',
      loading: false,
      validating: false,
      valid: false,
      addressError: ''
    }
  },

  computed: {
    ...mapState(["eth", "account"]),
    addressErrorState() {
      let result = [];
      if(this.addressError) {
        result.push(this.addressError);
      }

      return result;
    }
  },

  watch: {
    retailerAddress(addr) {
      if(this.eth.web3.utils.isAddress(addr)) {
        this.validating = true;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.validateAddress(addr), 400);
      }
    }
  },

  methods: {
    async validateAddress(addr) {
      try {
        if(await this.eth.instance.isRetailer(addr)) {
          this.addressError = '';
        } else {
          this.addressError = 'The specified address does not belong to a retailer!';
        }
      } catch(e) {
        this.addressError = 'Unexpected error while validating retailer address!';
      } finally {
        this.validating = false;
      }
    },
    isRequired(str) {
      return !!str || "This field is required!";
    },
    isAddress(str) {
      return this.eth.web3.utils.isAddress(str) || 'Not a valid ethereum address!';
    },
    async shipItem() {
      this.loading = true;
      try {
        await this.eth.instance.shipItem(
          this.upc, 
          this.retailerAddress,
          { from: this.account.address }
        );
        this.$router.push(`/${this.upc}`);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>
