<script>
import { Doughnut } from "vue-chartjs";

export default {
  name: "CGraficaTotalDay",
  extends: Doughnut,
  props: ["chardataset"],
  data: () => ({
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  }),
  mounted() {
    this.renderChart(this.chardataset, this.options);
  },
};
</script>

<style>
</style>