<template>
  <div id="app">
    <nav-bar />
    <b-container class="bv-example-row">
      <br />
      <h4 class="title">CORONAVIRUS COVID19 API</h4>
      <b-row class="row">
        <b-col>
          <b-card class="margin-top">
            <h4 class="title">DATOS GLOBALES</h4>
            <CLineChart :chartdata="chartdata" v-if="!loading" />
            <pulse-loader class="pulseSpinner" :loading="loading" :color="color" :size="size"></pulse-loader>
          </b-card>
        </b-col>
        <b-col>
          <b-card class="margin-top">
            <pulse-loader class="pulseSpinner" :loading="loadingPais" :color="color" :size="size"></pulse-loader>
            <h4 class="title">DATOS POR PAIS</h4>
            <b-form-select v-model="selected" v-if="!loadingPais" :options="optionsSelectPais"></b-form-select>
            <b-alert
              class="alert-margin-top"
              v-model="showDismissibleAlert"
              v-show="showDismissibleAlert"
              variant="danger"
              dismissible
            >No hay información de casos en ese país</b-alert>
            <LineChartByCountry v-if="!loadingPais" :chartdata="chartdataPais" />
          </b-card>
        </b-col>
      </b-row>
      <br />
      <hr />
      <br />
      <h4 class="title">API COVID-19 data</h4>
      <b-row class="row">
        <b-col>
          <b-card class="margin-top">
            <h4 class="title">DATOS TOTALES</h4>
            <pulse-loader class="pulseSpinner" :loading="loadingDay" :color="color" :size="size"></pulse-loader>

            <CGraficaTotalDay v-if="!loadingDay" :chardataset="chardatasetDia" />
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
//GRAFICAS
import CLineChart from "./components/CLineChart.vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import LineChartByCountry from "./components/LineChartByCountry.vue";
import CGraficaTotalDay from "./components/CGraficaTotalDay.vue";

export default {
  name: "App",
  components: {
    NavBar,
    CLineChart,
    PulseLoader,
    LineChartByCountry,
    CGraficaTotalDay,
  },
  data() {
    return {
      loading: true,
      loadingPais: true,
      selected2: null,
      loadingPais2: true,
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
      loadingDay: true,
      chartdataPais: {
        labels: [],
        datasets: [
          {
            label: "Confirmed",
            backgroundColor: "#eeeeee",
            data: [],
          },
          {
            label: "Deaths",
            backgroundColor: "#222831",
            data: [],
          },
          {
            label: "Recovered",
            backgroundColor: "#4f8a8b",
            data: [],
          },
          {
            label: "Active",
            backgroundColor: "#fbd46d",
            data: [],
          },
        ],
      },
      chardatasetDia: {
        labels: ["Confirmed", "Deaths", "Recovered", "Active"],
        datasets: [
          {
            backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
            data: [],
          },
        ],
      },
      chardatasetDayli: {
        labels: ["Confirmed", "Deaths", "Recovered", "Active"],
        datasets: [
          {
            backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
            data: [],
          },
        ],
      },
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
          let promesaLimpiar = new Promise((resolve) => {
            this.chartdataPais = {
              labels: [],
              datasets: [
                {
                  label: "Confirmed",
                  backgroundColor: "#eeeeee",
                  data: [],
                },
                {
                  label: "Deaths",
                  backgroundColor: "#222831",
                  data: [],
                },
                {
                  label: "Recovered",
                  backgroundColor: "#4f8a8b",
                  data: [],
                },
                {
                  label: "Active",
                  backgroundColor: "#fbd46d",
                  data: [],
                },
              ],
            };
            resolve(true);
          });
          promesaLimpiar.then((sucess) => {
            if (response.data.length > 0 && sucess) {
              console.log(
                `pais ${response.data[0].Country} con la cantidad de ${response.data.length}`
              );
              let checador = false;
              let checadorDual = true;
              if (response.data.length > 1000) {
                checador = true;
              }
              response.data.forEach((iteam) => {
                if (
                  iteam.Active !== 0 ||
                  iteam.Confirmed !== 0 ||
                  iteam.Deaths !== 0
                ) {
                  if (checador) {
                    if (checadorDual) {
                      this.chartdataPais.labels.push(iteam.Date);
                      this.chartdataPais.datasets[0].data.push(iteam.Confirmed);
                      //CASOS MUERTOS
                      this.chartdataPais.datasets[1].data.push(iteam.Deaths);
                      //CASOS RECUPERADOS
                      this.chartdataPais.datasets[2].data.push(iteam.Recovered);
                      //CASOS ACTIVOS
                      this.chartdataPais.datasets[3].data.push(iteam.Active);
                      checadorDual = false;
                    } else {
                      checadorDual = true;
                    }
                  } else {
                    this.chartdataPais.labels.push(iteam.Date);
                    this.chartdataPais.datasets[0].data.push(iteam.Confirmed);
                    //CASOS MUERTOS
                    this.chartdataPais.datasets[1].data.push(iteam.Deaths);
                    //CASOS RECUPERADOS
                    this.chartdataPais.datasets[2].data.push(iteam.Recovered);
                    //CASOS ACTIVOS
                    this.chartdataPais.datasets[3].data.push(iteam.Active);
                  }
                }
              });

              this.loadingPais = false;
            } else {
              this.showDismissibleAlert = true;
              this.loadingPais = false;
            }
          });
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

    this.axios
      .get("https://covid-19-data.p.rapidapi.com/report/totals", {
        headers: {
          "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
          "x-rapidapi-key":
            "f0864a4133msh3f72fb08d19e2a9p10776bjsn5842249d2df4",
          useQueryString: true,
        },
        params: {
          "date-format": "YYYY-MM-DD",
          format: "json",
          date: "2020-07-21",
        },
      })
      .then((response) => {
        console.log(response.data[0]);
        //CONFIRMADOS
        this.chardatasetDia.datasets[0].data.push(response.data[0].confirmed);
        //CRITICOS
        this.chardatasetDia.datasets[0].data.push(response.data[0].critical);
        //MUERTES
        this.chardatasetDia.datasets[0].data.push(response.data[0].deaths);
        //RECUPERADOS
        this.chardatasetDia.datasets[0].data.push(response.data[0].recovered);

        this.loadingDay = false;
      });
    // this.axios
    //   .get("https://covid-19-data.p.rapidapi.com/report/totals", {
    //     headers: {
    //       "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
    //       "x-rapidapi-key":
    //         "f0864a4133msh3f72fb08d19e2a9p10776bjsn5842249d2df4",
    //       useQueryString: true,
    //     },
    //   })
    //   .then((response) => {
    //     console.log(response);
    //   });
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
  height: 100%;
}
.container {
  margin-right: 0px !important;
  margin-left: 0px !important;
  padding-right: 2px !important;
  padding-left: 2px !important;
}
.row {
  width: 100%;
  margin-right: 2px !important;
  margin-left: 2px !important;
}
@media (min-width: 1200px) {
  .container {
    max-width: 100% !important;
    padding-right: 2px !important;
    padding-left: 2px !important;
  }
}
@media (min-width: 768px) {
  .container {
    max-width: 100% !important;
    padding-right: 2px !important;
    padding-left: 2px !important;
  }
}
.title {
  color: #393e46;
}
.alert-margin-top {
  margin-top: 10px;
}
</style>
