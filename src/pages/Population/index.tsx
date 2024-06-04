import useEcharts from '@/hooks/useEcharts';

const App = () => {

  const options = {
    title: {
      text: '示例图表',
    },
    tooltip: {},
    xAxis: {
      data: ['A', 'B', 'C', 'D', 'E', 'F'],
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20],
      },
    ],
  };
  const echartDom = useEcharts(options)
  return <div>{echartDom}</div>;
};

export default App;
