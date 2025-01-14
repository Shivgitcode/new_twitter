import "./index.css"
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import Comment from "./pages/Comment"
import Protected from "./protected/Protected"
function App() {
  return (
    <div className=" font-roboto w-full bg-black min-h-full m-0 p-0">
      <Routes>
        <Route path="/" element={<Protected fallback={<Login />}>
          <Home></Home>
        </Protected>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/signup" element={<SignUp></SignUp>}></Route>
        <Route path="/comment/:id" element={<Comment></Comment>}></Route>
      </Routes>
    </div>
  )

}

export default App
