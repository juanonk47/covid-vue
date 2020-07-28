<template>
  <div id="app">
    <nav-bar />
    <b-container class="bv-example-row">
      <b-row>
        <b-col>
          <b-card class="margin-top">
            <h4>DATOS GLOBALES</h4>
            <CLineChart :chartdata="chartdata" v-if="!loading" />
            <pulse-loader class="pulseSpinner" :loading="loading" :color="color" :size="size"></pulse-loader>
          </b-card>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <b-card class="margin-top">
            <pulse-loader class="pulseSpinner" :loading="loadingPais" :color="color" :size="size"></pulse-loader>
            <h4>Datos de pais</h4>
            <b-form-select v-model="selected" v-if="!loadingPais" :options="optionsSelectPais"></b-form-select>
            <b-alert v-show="showDismissibleAlert" variant="danger" show>Dismissible Alert!</b-alert>
            <LineChartByCountry v-if="!loadingPais" />
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import CLineChart from "./components/CLineChart.vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import LineChartByCountry from "./components/LineChartByCountry.vue";

export default {
  name: "App",
  components: {
    NavBar,
    CLineChart,
    PulseLoader,
    LineChartByCountry,
  },
  data() {
    return {
      loading: true,
      loadingPais: true,
      color: "#00adb5",
      colorDatasets: ["#00b8a9", "#ffde7d", "#f6416c"],
      size: "100px",
      showDismissibleAlert: false,
      chartdata: {
        labels: ["GLOBAL"],
        datasets: [],
      },
      selected: null,
      optionsSelectPais: [],
    };
  },
  watch: {
    // whenever question changes, this function will run
    selected: function (newQuestion) {
      this.getStatusByContry(newQuestion);
    },
  },
  methods: {
    getStatusByContry(country) {
      this.loadingPais = true;
      this.axios
        .get(
          `https://api.covid19api.com/country/${country}?from=2020-03-01T00:00:00Z&to=2020-04-01T00:00:00Z`
        )
        .then((response) => {
          console.log(response);
          if (response.data.lenght > 0) {
            this.showDismissibleAlert = true;
          }
          this.loadingPais = false;
        });
    },
  },
  mounted() {
    this.axios.get("https://api.covid19api.com/summary").then((response) => {
      let promesa = new Promise((resolve) => {
        for (let i = 0; i < 5; i++) {
          if (!Object.keys(response.data.Global)[i].includes("Total")) {
            this.chartdata.datasets.push({
              label: Object.keys(response.data.Global)[i],
              backgroundColor: this.colorDatasets[i],
              data: [
                response.data.Global[Object.keys(response.data.Global)[i]],
              ],
            });
          }
        }

        resolve(false);
      });
      promesa.then((resolve) => {
        this.loading = resolve;
      });
    });

    this.axios.get("https://api.covid19api.com/countries").then((response) => {
      let data = response.data;
      console.log(data);
      data.forEach((pais) => {
        this.optionsSelectPais.push({
          value: pais.Slug,
          text: pais.Country,
        });
      });
      this.loadingPais = false;
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
.pulseSpinner {
  margin: 15% 15%;
}
.margin-top {
  margin-top: 3%;
}
</style>
