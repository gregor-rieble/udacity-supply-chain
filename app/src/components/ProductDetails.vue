<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field dense readonly prepend-inner-icon="mdi-barcode-scan" hint="Universal Product Code" label="UPC" :value="item.itemUPC"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6" class="pr-1">
        <v-text-field dense readonly prepend-inner-icon="mdi-qrcode-scan" hint="Stock Keeping Unit" label="SKU" :value="item.itemSKU"></v-text-field>
      </v-col>
      <v-col cols="6" class="pl-1">
        <v-text-field dense readonly prepend-inner-icon="mdi-identifier" hint="The unique product ID" label="Product ID" :value="item.productID"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field dense readonly prepend-inner-icon="mdi-message-bulleted" hint="Additional details for the harvested item" label="Product Notes" :value="item.productNotes"></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>