import Vue from 'vue';
import VueRouter from 'vue-router'
import TrackForm from '../components/TrackForm'
import ItemDetails from '../components/ItemDetails'
import HarvestItem from '../components/HarvestItem'
import SellItem from '../components/SellItem'
import BuyItem from '../components/BuyItem'
import ShipItem from '../components/ShipItem'
import ReceiveItem from '../components/ReceiveItem'
import PurchaseItem from '../components/PurchaseItem'

Vue.use(VueRouter);

export default new VueRouter({
  routes: [{
    path: '/',
    component: TrackForm
  }, {
    path: '/:upc',
    component: ItemDetails
  }, {
    path: '/:upc/harvest',
    component: HarvestItem
  }, {
    path: '/:upc/sell',
    component: SellItem
  }, {
    path: '/:upc/buy',
    component: BuyItem
  }, {
    path: '/:upc/ship',
    component: ShipItem
  }, {
    path: '/:upc/receive',
    component: ReceiveItem
  }, {
    path: '/:upc/purchase',
    component: PurchaseItem
  }]
});
