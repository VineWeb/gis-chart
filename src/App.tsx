import { BrowserRouter as Router } from "react-router-dom";
import router from './routers'
import '@/style/index.scss'
const baseURL = import.meta.env.VITE_BASE_URL
function App() {
  return (
    <Router basename={baseURL}>
     {router()}
    </Router>
  )
}

export default App
