<template>
  <v-card>
    <v-card-title>
      <v-icon class="mr-3">mdi-coffee</v-icon>
      Harvest Item
      <v-spacer></v-spacer>
      <v-btn text outlined @click="$router.push('/' + upc)">
        <v-icon class="mr-1">mdi-chevron-left</v-icon>
        Back
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-form v-model="valid">
        <div class="text-center" v-if="!itemDetails || loading"><v-progress-circular indeterminate></v-progress-circular></div>
        <v-alert type="error" v-else-if="itemExists">An item with the supplied UPC already exists!</v-alert>
        <v-alert type="error" v-else-if="!isFarmer">You must be a farmer in order to create new items!</v-alert>
        <v-container v-else>
          <v-row no-gutters>
            <v-col cols="12">
              <v-text-field :rules="[isRequired]" disabled prepend-inner-icon="mdi-barcode-scan" hint="Universal Product Code" label="UPC" :value="upc"></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12">
              <v-text-field :rules="[isRequired]" prepend-inner-icon="mdi-barn" hint="The farm where the item was harvested" label="Farm Name" v-model="name"></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12">
              <v-text-field :rules="[isRequired]" prepend-inner-icon="mdi-information" hint="A short description of the farm" label="Farm Information" v-model="information"></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="6" class="pr-1">
              <v-text-field :rules="[isNumeric, isRequired]" prepend-inner-icon="mdi-crosshairs-gps" hint="The Latitude of the farm" label="Latitude" v-model="latitude"></v-text-field>
            </v-col>
            <v-col cols="6" class="pl-1">
              <v-text-field :rules="[isNumeric, isRequired]" prepend-inner-icon="mdi-crosshairs-gps" hint="The Longitude of the farm" label="Longitude" v-model="longitude"></v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12">
              <v-text-field :rules="[isRequired]" prepend-inner-icon="mdi-message-bulleted" hint="Additional details for the harvested item" label="Product Notes" v-model="notes"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="text-center">
              <v-btn :disabled="!valid" x-large color="success" @click="harvestItem">
                <v-icon class="mr-3">mdi-feather</v-icon>
                Harvest Item
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import itemDetails from "../mixins/item-details";
import roles from "../mixins/roles";
import { mapState } from "vuex";

export default {
  mixins: [itemDetails, roles],

  data() {
    return {
      name: '',
      information: '',
      latitude: '',
      longitude: '',
      notes: '',
      loading: false,
      valid: false
    }
  },

  computed: {
    ...mapState(["eth", "account"])
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
    async harvestItem() {
      this.loading = true;
      try {
        await this.eth.instance.harvestItem(
          this.upc, 
          this.account.address, 
          this.name, 
          this.information, 
          this.latitude, 
          this.longitude, 
          this.notes, 
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
