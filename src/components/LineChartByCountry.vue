
<script>
import { Line } from "vue-chartjs";

export default {
  name: "LineChartByCountry",
  extends: Line,
  props: ["chartdata"],
  data: () => ({
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  }),

  mounted() {
    this.renderChart(this.chartdata, this.options);
  },
};
</script>

<style>
</style>