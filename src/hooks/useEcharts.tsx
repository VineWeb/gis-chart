import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
const useEcharts = (options: any) => {
  const chartRef = useRef(null);
  useEffect(() => {
    let chartInstance = null
    if (chartRef.current) {
      chartInstance = echarts.init(chartRef.current);
      chartInstance.setOption(options);
    }
    const updateSize = () => {
      chartInstance?.resize();
    };
    window.addEventListener('resize', updateSize)
    return () => {
      window.removeEventListener('resize', updateSize);
    }
  }, [options]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default useEcharts;
