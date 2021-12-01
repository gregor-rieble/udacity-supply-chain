import { mapState } from "vuex";

export default {
  data() {
    return {
      itemDetails: null
    }
  },
  
  mounted() {
    this.loadItemDetails(this.upc);
  },

  computed: {
    ...mapState(["eth", "account"]),
    upc() {
      return this.$route.params.upc;
    },
    itemOwner() {
      return this.itemDetails && this.account && this.itemDetails.ownerID === this.account.address;
    },
    itemExists() {
      return this.itemDetails && this.itemDetails.itemSKU != 0 && (""+this.itemDetails.itemUPC) === (""+this.upc);
    }
  },

  watch: {
    upc(upc) {
      this.loadItemDetails(upc);
    }
  },

  methods: {
    async loadItemDetails(upc) {
      this.itemDetails = Object.assign(
        {},
        await this.eth.instance.fetchItemBufferOne(upc),
        await this.eth.instance.fetchItemBufferTwo(upc),
        await this.eth.instance.fetchItemBufferThree(upc)
      );
      
      return this.itemDetails;
    }
  }
}