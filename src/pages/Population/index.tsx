import useEcharts from "@/hooks/useEcharts";

const App = () => {
  const years = [1953, 1964, 1982, 1990, 2000, 2010, 2020];
  const population = [58260, 69458, 100818, 113368, 126583, 133972, 141178];
  // 计算增长率
  const growthRate = [0];
  for (let i = 1; i < population.length; i++) {
    const rate = (population[i] - population[i - 1]) / population[i - 1];
    const val = Number((rate * 100).toFixed(2))
    growthRate.push(val);
  }
  const options = {
    toolbox: {
      feature: {
        dataView: { show: true, type: ['line', 'bar'] },
        restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#283b56'
        }
      },
      formatter: 
      `{a}<br/>
      {b}: {c}万人<br/>
      {a1}<br/>
      {b1}: {c1}%
      `
    },
    legend: {
      data: ['人口总数', '人口增长率']
    },
    xAxis: [
      {
        type: 'category',
        data: years,
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '万人',
        min: 0,
        axisLabel: {
          formatter: '{value}'
        }
      },
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '人口总数',
        type: 'bar',
        data: population
      },
      {
        name: '人口增长率',
        type: 'line',
        yAxisIndex: 1, // 设置使用第二个 y 轴
        data: growthRate
      },
    ],
  };
  const echartDom = useEcharts(options);
  return <div>{echartDom}</div>;
};

export default App;
