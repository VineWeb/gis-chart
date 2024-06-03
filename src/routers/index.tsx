import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Tourism from '@/pages/Tourism';
import Guangdong from '@/pages/Tourism/guangdong';
import YueA from '@/pages/Guangzhou/yuea';
import News from '@/pages/Guangzhou/news';
const Router = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout></Layout>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<div>About</div>} />
        <Route path="/tourism" element={<Tourism />} />
        <Route path="/gd" element={<Guangdong />} />
       
        <Route path="/guangzhou/news" element={<News />} />
        <Route path="/guangzhou/yuea" element={<YueA />} />
      </Route>
    </Routes>
  )
};

export default Router;