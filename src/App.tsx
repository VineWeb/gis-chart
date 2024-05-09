import { BrowserRouter as Router } from "react-router-dom";
import router from './routers'
function App() {
  return (
    <Router>
     {router()}
    </Router>
  )
}

export default App
