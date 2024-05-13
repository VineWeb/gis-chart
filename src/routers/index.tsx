import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Tourism from '@/pages/Tourism';
const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="about" element={<div>About</div>} />
      <Route path="tourism" element={<Tourism />} />
      {/* <Route
        path="/"
        element={
          <>
            <Header />
            // 使用 Outlet 显示嵌套的子路由 
            <Outlet />
          </>
        }
      >
      </Route> */}
    </Routes>
  )
};

export default Router;