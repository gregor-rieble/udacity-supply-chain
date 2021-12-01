import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["account"]),
    isFarmer() {
      return this.account && this.account.farmer === true;
    },
    isDistributor() {
      return this.account && this.account.distributor === true;
    },
    isRetailer() {
      return this.account && this.account.retailer === true;
    },
    isConsumer() {
      return this.account && this.account.consumer === true;
    },
    isContractOwner() {
      return this.account && this.account.owner === true;
    }
  }
}