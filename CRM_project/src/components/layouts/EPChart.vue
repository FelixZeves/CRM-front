<script setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const series = computed(() => [
  {
    name: 'Средняя оценка',
    data: props.data.map(c => c.avgScore)
  },
  
])

const chartOptions = computed(() => ({
    chart: {
      id: 'performance-chart',
      toolbar: {
        show: false
      }
    },
    xaxis: { categories: props.data.map(c => c.className) },
    stroke: {
        width: 3,
        curve: 'smooth'
    },
    dataLabels: {
        enabled: false
    },
    markers: {
        discrete: props.data.map((c, idx) => ({
          seriesIndex: 0,
          dataPointIndex: idx,
          size: 8,
          strokeWidth: 4,
          fillColor: '#fff',
          strokeColor: c.avgScore <= 3.5 ? '#DC1919' :  c.avgScore >= 4.5 ? '#14DC14' : '#825AFF',
        })),
        hover: {
          size: 12,
        }
    },
    fill: {
        type: "gradient",
        gradient: {
        shadeIntensity: 1,
        type: "vertical",
        gradientToColors: ['#F2F2F2'],
        opacityFrom: 0.6,
        opacityTo: 1
        }
    },
    tooltip: {
      theme: 'light',
      marker: {
        show: false,
      },
      style: {
        fontSize: 'md',
        fontFamily: 'inherit',
      },
      fillSeriesColor: false,
      x: {
        formatter: (value, { dataPointIndex, w }) => {
          const item = props.data[dataPointIndex]
          return `Класс ${item.className}`  // или тут "параллель.номер"
        }
      }
    },
    colors: ['#825AFF'],
}))

</script>

<template>
  <VueApexCharts
    height="200px"
    type="area"
    :options="chartOptions"
    :series="series"
  />
</template>

<style>

.apexcharts-tooltip-title{
  font-weight: bold !important;
}

.apexcharts-tooltip-text{
  font-weight: normal !important;
}

</style>