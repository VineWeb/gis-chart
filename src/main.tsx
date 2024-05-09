import { ConfigProvider } from 'antd';
import { createRoot } from 'react-dom/client'
import zhCN from 'antd/locale/zh_CN';
import App from './App.tsx'
import { Provider } from 'react-redux';
import store from './store/index';
const container = document.getElementById('root')!
const root = createRoot(container)
root.render(
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </Provider>
)
