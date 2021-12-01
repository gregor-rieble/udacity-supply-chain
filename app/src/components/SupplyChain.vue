<template>
  <v-timeline dense>
    <v-timeline-item icon="mdi-timer-sand" v-if="nextState" color="grey" fill-dot small>
      {{ nextState.name }}
    </v-timeline-item>
    <v-timeline-item hide-dot v-if="action">
      <v-btn :loading="actionLoading" large :color="action.color" @click="executeAction">
        <v-icon class="mr-3">{{ action.icon }}</v-icon>
        {{ action.name }}
      </v-btn>
    </v-timeline-item>
    <template v-for="data in computedStates">
      <v-timeline-item color="success" icon="mdi-check" fill-dot small :key="data.name">
        <v-card>
          <v-card-title>
            {{ data.name }}
            <v-spacer></v-spacer>
            <v-chip small :color="data.color">{{ data.actor }}</v-chip>
          </v-card-title>
          <v-card-subtitle class="caption" style="font-size: 10px !important;" v-if="data.tx">
            TX: {{ data.tx.tx.hash }}
          </v-card-subtitle>
          <v-card-text v-if="data.details">
            <v-list dense>
              <v-list-item style="min-height: 0; height: 50px;" two-line v-for="details in data.details" :key="details.title">
                <v-list-item-avatar>
                  <v-icon v-if="details.icon">{{ details.icon }}</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-subtitle>{{ details.title }}</v-list-item-subtitle>
                  <v-list-item-title>{{ details.value() }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </template>
  </v-timeline>
</template>

<script>
import { mapState } from 'vuex'
import roles from '../mixins/roles'
import abiDecoder from 'abi-decoder'

export default {
  mixins: [roles],
  props: {
    item: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      required: false
    }
  },

  data() {
    return {
      executing: false,
      transactions: [],
      states: [{
        name: 'Harvested',
        actor: 'Farmer',
        color: 'error',
        details: [{
          title: 'Farmer',
          value: () => this.item.originFarmerID,
          icon: 'mdi-account'
        }, {
          title: 'Farm',
          value: () => this.item.originFarmName,
          icon: 'mdi-barn'
        }, {
          title: 'Farm Information',
          value: () => this.item.originFarmInformation,
          icon: 'mdi-information'
        }, {
          title: 'Location',
          value: () => 'Lat: ' + this.item.originFarmLatitude + ', Long: ' + this.item.originFarmLongitude,
          icon: 'mdi-crosshairs-gps'
        }],
        action: {
          method: 'harvestItem'
        }
      }, {
        name: 'Processed',
        actor: 'Farmer',
        color: 'error',
        action: {
          name: 'Process Item',
          color: 'success',
          icon: 'mdi-skip-next-outline',
          active: () => this.isFarmer && this.isOwner,
          method: 'processItem',
          params: () => []
        }
      }, {
        name: 'Packed',
        actor: 'Farmer',
        color: 'error',
        action: {
          name: 'Pack Item',
          color: 'success',
          icon: 'mdi-package-variant',
          active: () => this.isFarmer && this.isOwner,
          method: 'packItem',
          params: () => []
        }
      }, {
        name: 'For Sale',
        actor: 'Farmer',
        color: 'error',
        action: {
          name: 'Sell Item',
          color: 'success',
          icon: 'mdi-currency-usd',
          method: 'sellItem',
          active: () => this.isFarmer && this.isOwner,
          handler: () => this.$router.push(`/${this.upc}/sell`)
        },
        details: [{
          title: 'Price',
          value: () => this.eth.web3.utils.fromWei(this.item.productPrice) + ' ETH',
          icon: 'mdi-currency-usd'
        }]
      }, {
        name: 'Sold',
        actor: 'Distributor',
        color: 'warning',
        action: {
          name: 'Buy Item',
          color: 'success',
          icon: 'mdi-basket',
          method: 'buyItem',
          active: () => this.isDistributor,
          handler: () => this.$router.push(`/${this.upc}/buy`)
        },
        details: [{
          title: 'Distributor',
          value: () => this.item.distributorID,
          icon: 'mdi-account'
        }, {
          title: 'Retailer Price',
          value: () => this.eth.web3.utils.fromWei(this.item.retailerPrice) + ' ETH',
          icon: 'mdi-currency-usd'
        }]
      }, {
        name: 'Shipped',
        actor: 'Distributor',
        color: 'warning',
        action: {
          name: 'Ship Item',
          color: 'success',
          icon: 'mdi-truck',
          method: 'shipItem',
          active: () => this.isDistributor && this.isOwner,
          handler: () => this.$router.push(`/${this.upc}/ship`)
        }
      }, {
        name: 'Received',
        actor: 'Retailer',
        color: 'success',
        action: {
          name: 'Receive Item',
          color: 'success',
          icon: 'mdi-call-received',
          method: 'receiveItem',
          active: () => this.isRetailer && this.item.retailerID === this.account.address,
          handler: () => this.$router.push(`/${this.upc}/receive`)
        },
        details: [{
          title: 'Retailer',
          value: () => this.item.retailerID,
          icon: 'mdi-account'
        }, {
          title: 'Consumer Price',
          value: () => this.eth.web3.utils.fromWei(this.item.consumerPrice) + ' ETH',
          icon: 'mdi-currency-usd'
        }]
      }, {
        name: 'Purchased',
        actor: 'Consumer',
        color: 'primary',
        action: {
          name: 'Purchase Item',
          color: 'success',
          icon: 'mdi-shopping',
          method: 'purchaseItem',
          active: () => this.isConsumer,
          handler: () => this.$router.push(`/${this.upc}/purchase`)
        },
        details: [{
          title: 'Consumer',
          value: () => this.item.consumerID,
          icon: 'mdi-account'
        }]
      }]
    }
  },

  computed: {
    ...mapState(["account", "eth"]),
    actionLoading() {
      return this.executing || this.loading;
    },
    upc() {
      return this.item.itemUPC;
    },
    action() {
      if(this.nextState && this.nextState.action && this.nextState.action.active()) {
        return this.nextState.action;
      }

      return null;
    },
    nextState() {
      if(this.stateNo < (this.states.length - 1)) {
        return this.states[this.stateNo + 1];
      }

      return null;
    },
    currentState() {
      return this.states[this.stateNo];
    },
    completedStates() {
      return this.states.slice(0, this.stateNo + 1).reverse();
    },
    computedStates() {
      return this.completedStates.map(s => {
        let method = s.action && s.action.method || '';
        
        let tx = this.transactions.find(t => t.method.name === method);
        
        return Object.assign({}, s, { tx });
      });
    },
    stateNo() {
      return parseInt(this.item.itemState);
    },
    state() {
      return this.currentState.name;
    },
    isOwner() {
      return this.item.ownerID === this.account.address;
    }
  },

  mounted() {
    abiDecoder.addABI(this.eth.instance.abi);
    this.loadTransactions();
  },

  watch: {
    item() {
      this.loadTransactions();
    }
  },

  methods: {
    async executeAction() {
      this.executing = true;
      try {
        if(this.action.handler) {
          this.action.handler();
        } else {
          let params = this.action.params().slice();

          params.unshift(parseInt(this.upc));
          params.push({
            from: this.account.address
          });

          await this.eth.instance[this.action.method].apply(this.eth.instance, params);
          this.$emit("action-triggered");
        }
      } finally {
        this.executing = false;
      }
    },
    async loadTransactions() {
      let blockNumbers = await this.loadBlockNumbers();

      let tasks = [];
      for(let no of blockNumbers) {
        tasks.push(this.eth.web3.eth.getBlock(no).then(this.loadTransaction));
      }

      let data = await Promise.all(tasks);
      this.transactions = [].concat.apply([], data).filter(t => t.to === this.eth.instance.address)
        .map(tx => {
          let method = abiDecoder.decodeMethod(tx.input);
          return { tx, method };
        })
        .filter(t => t.method.params[0].value == ''+this.item.itemUPC);
    },
    async loadTransaction(block) {
      let tasks = [];
      for(let t of block.transactions) {
        tasks.push(this.eth.web3.eth.getTransaction(t));
      }

      let data = await Promise.all(tasks);
      return data;
    },
    async loadBlockNumbers() {
      let itemsHistory = await this.eth.instance.getItemsHistory(this.item.itemUPC, 0);
      let totalTransactions = parseInt(itemsHistory.totalTransactions);

      let page = 0;
      let result = [];
      for(let i = 0; i < totalTransactions; i++) {
        let index = i % 10;
        if(i !== 0 && index === 0) {
          page++;
          itemsHistory = await this.eth.instance.getItemsHistory(this.upc, page);
        }

        let blockNo = parseInt(itemsHistory[index + 1]);
        result.push(blockNo);
      }

      return result;
    }
  }
}
</script>