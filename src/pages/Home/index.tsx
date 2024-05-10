import useMapbox from '@/hooks/useMapbox.ts';
import useGetData from '@/hooks/useGetData.ts';
import './index.scss'
import { requestChinaData } from '@/config'
function Home () {
  const { addSource } = useMapbox('container');
  const chinaJson = useGetData(requestChinaData);
  if (chinaJson) {
    addSource(chinaJson)
  }
  return (
    <>
      首页
      <div id='container' className='map'></div>
    </>
  )
}


export default Home