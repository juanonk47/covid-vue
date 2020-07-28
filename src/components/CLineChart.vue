
<script>
import {  Bar } from 'vue-chartjs'


export default {
    name: 'CLineChart',
    extends: Bar,
    props: ['chartdata'],
  data: () => ({
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  }),

  mounted () {
    
    this.renderChart(this.chartdata, this.options)
  },

  
}
</script>

<style>

</style>