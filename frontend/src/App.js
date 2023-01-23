import {
    Streamlit,
    StreamlitComponentBase,
    withStreamlitConnection,
  } from "streamlit-component-lib"
  import React from "react"
import Header from "./header"

import { BrowserRouter, Routes, Route } from "react-router-dom";
  
class App extends StreamlitComponentBase {
    render() {
      return(
        <Header/>
      )}
}

export default withStreamlitConnection(App)
