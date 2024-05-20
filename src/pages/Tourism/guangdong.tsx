import useMapbox from '@/hooks/useMapbox.ts';
import useGetData from '@/hooks/useGetData.ts';
import { getGuangdongJson, getGuangdongSource } from '@/config/http'
import { useEffect } from 'react';
function Home () {
  const { map, addSource, addMarkersPopup } = useMapbox('container');
  const chinaJson = useGetData(getGuangdongJson);
  if (chinaJson) {
    addSource(chinaJson)
  }
  const data = useGetData(getGuangdongSource);
  useEffect(() => {
    if (data && data.list) {
      const list = data.list.map((item: any) => ({...item, provinceName: item.cityInfo}))
      addMarkersPopup(list)
      map.setZoom(7)
    }
  }, [data])
  return (
    <>
      <div id='container'className='map'></div>
    </>
  )
}


export default Home