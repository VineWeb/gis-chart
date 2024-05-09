import useMapbox from '@/hooks/useMapbox.ts';
import './index.scss'
function Home () {
  useMapbox('container');
  return (
    <>
      首页
      <div id='container' className='map'></div>
    </>
  )
}


export default Home