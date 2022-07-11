import {
    Streamlit,
    StreamlitComponentBase,
    withStreamlitConnection,
  } from "streamlit-component-lib"
  import React from "react"
import MyComponent from "./MyComponent"
import Header from "./header"
import Footer from "./footer"
import { BrowserRouter, Routes, Route } from "react-router-dom";
  
class App extends StreamlitComponentBase {
    render() {
      return(
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Header/>} />
              <Route path="/MidComponent" element={<MyComponent/>} />
              <Route path="/foot" element={<Footer/>} />
            </Routes>
          </BrowserRouter>
      )
    }
}

export default withStreamlitConnection(App)
