<template>
  <b-navbar toggleable="lg" type="dark" variant="dark">
    <b-navbar-brand href="#">COVID19</b-navbar-brand>
  </b-navbar>
</template>

<script>

import { BNavbar,BNavbarNav, BNavbarBrand } from "bootstrap-vue";

export default {
name: 'NavBar',
components: [BNavbar,BNavbarNav,BNavbarBrand]
}
</script>

<style>

</style>