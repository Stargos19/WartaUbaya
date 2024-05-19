import { useState, useEffect} from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import './firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth"
import Absen from "./pages/absen";
import SignIn from "./pages/signin";
import History from "./pages/history";


function App() {

//state
const [isLogin, setIsLogin] = useState(false)
const [loading, setLoading] = useState(true)

  //useEffect
  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (result)=>{
      if(result){
        setIsLogin(true)
        setLoading(false)
        return
      }
      setIsLogin(false)
      setLoading(false)
    })
  }, [])

  if(loading){
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center"> Loading.. </div>
    )
  }

  return (
    <>     
      {isLogin ? (
        <Routes>
          <Route path="/history" element={<History />} />
          <Route path="*" element={<Absen />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<Absen />} />
        </Routes>
      )}
    </>
  );
}

export default App;
