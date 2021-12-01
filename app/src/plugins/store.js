import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    eth: null,
    account: ""
  },
  mutations: {
    setEth(state, eth) {
      state.eth = eth;
    },
    setAccount(state, account) {
      state.account = account;
    }
  },
  actions: {
    async initialize({ commit, dispatch }, eth) {
      commit('setEth', eth);
      await dispatch('loadAccountDetails');
      await dispatch('watchAndUpdateAccount');
    },
    async loadAccountDetails({ commit, state }) {
      if(state.eth) {
        let accounts = await state.eth.web3.eth.getAccounts();
        let details = await state.eth.instance.getRoles({ from: accounts[0] });

        commit('setAccount', Object.assign(details, { address: accounts[0] }));
      }
    },
    async watchAndUpdateAccount({ state, dispatch }) {
      setTimeout(async () => {
        let accounts = await state.eth.web3.eth.getAccounts();

        if(state.account.address !== accounts[0]) {
          await dispatch('loadAccountDetails');
        }

        dispatch('watchAndUpdateAccount');
      }, 500);
    },
  }
});