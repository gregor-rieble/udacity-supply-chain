<template>
  <v-app>
    <v-main>
      <v-dialog persistent v-if="!initialized" :value="true">
        <v-container>
          <v-row>
            <v-col>
              <v-progress-circular :value="20" indeterminate></v-progress-circular>
              Loading...
            </v-col>
          </v-row>
        </v-container>
      </v-dialog>
      
      <v-container v-else fill-height fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" md="8" lg="6" xl="4">
            <v-alert v-if="error" type="error">
              {{ error }}
            </v-alert>

            <template v-else>
              <div class="mb-2">
                <div class="caption">{{ roles.filter(r => r.value).length > 1 ? 'Your Roles:' : 'Your Role:' }}</div>
                <v-chip class="mr-1" v-for="role in roles" :key="role.name" :color="role.color" :disabled="!role.value">{{ role.name }}</v-chip>
              </div>
              <router-view></router-view>
            </template>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import abi from "../../eth/build/contracts/SupplyChain.json";
import TruffleContract from "@truffle/contract";
import Web3 from "web3";
import roles from "./mixins/roles";

const contract = TruffleContract(abi);

export default {
  name: 'App',
  mixins: [roles],

  data: () => ({
    initialized: false,
    error: null
  }),

  async mounted() {
    try {
      let provider = await this.initProvider();
      let web3 = new Web3(provider);

      contract.setProvider(provider);
      let instance = await contract.deployed();

      await this.$store.dispatch('initialize', {
        provider,
        web3,
        contract,
        instance
      });
    } catch(e) {
      this.error = e;
    } finally {
      this.initialized = true;
    }
  },
  computed: {
    roles() {
      return [{
        name: "Consumer",
        value: this.isConsumer,
        color: "primary"
      }, {
        name: "Retailer",
        value: this.isRetailer,
        color: "success"
      }, {
        name: "Distributor",
        value: this.isDistributor,
        color: "warning"
      }, {
        name: "Farmer",
        value: this.isFarmer,
        color: "error"
      }];
    }
  },
  methods: {
    async initProvider() {
        if(window.ethereum) {
            var provider = window.ethereum;
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            return provider;
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            return window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            return new Web3.providers.HttpProvider('http://localhost:7545');
        }
      }
  }
};
</script>
