import { BrowserRouter as Router } from "react-router-dom";
import router from './routers'
import '@/style/index.scss'
function App() {
  return (
    <Router>
     {router()}
    </Router>
  )
}

export default App
