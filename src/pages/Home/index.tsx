import useMapbox from '@/hooks/useMapbox.ts';
import useGetData from '@/hooks/useGetData.ts';
import './index.scss'
import { requestChinaData, getDataSource, requestProvinceJson } from '@/config'
import { useEffect } from 'react';
function Home () {
  const { map, addSource, addJsonSource, addMarkers } = useMapbox('container');
  const chinaJson = useGetData(requestChinaData);
  if (chinaJson) {
    addSource(chinaJson)
  }
  
  const data = useGetData(getDataSource);
  useEffect(() => {
    function OnMapClick () {
      if (!map) return
      map.on('click', "layer_id", async function (e: any) {
        const adcode = e.features[0].properties.adcode
        const resJson = await requestProvinceJson(adcode)
        const isProvince = String(adcode).endsWith('0000')
        if (isProvince && resJson) {
          addJsonSource(resJson)
        }
      })
    }
    OnMapClick()
  }, [map])
  useEffect(() => {
    if (data && data.list) {
      const list = data.list
      addMarkers(list)
    }
 
  }, [data])
  return (
    <>
      <div id='container'className='map'></div>
    </>
  )
}


export default Home