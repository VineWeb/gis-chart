import useMapbox from '@/hooks/useMapbox.ts';
import useGetData from '@/hooks/useGetData.ts';
import './index.scss'
import { requestChinaData, getDataSource } from '@/config'
import { useEffect } from 'react';
function Home () {
  const { addSource, addMarkers } = useMapbox('container');
  const chinaJson = useGetData(requestChinaData);
  if (chinaJson) {
    addSource(chinaJson)
  }
  const data = useGetData(getDataSource);
  useEffect(() => {
    if (data && data.list) {
      const list = data.list
      addMarkers(list)
    }
  }, [data])
  return (
    <>
      首页
      <div id='container'className='map'></div>
    </>
  )
}


export default Home