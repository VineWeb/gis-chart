import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Tourism from '@/pages/Tourism';
import Guangdong from '@/pages/Tourism/guangdong';
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
      </Route>
    </Routes>
  )
};

export default Router;