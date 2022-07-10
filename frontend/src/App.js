import {
    Streamlit,
    StreamlitComponentBase,
    withStreamlitConnection,
  } from "streamlit-component-lib"
  import React from "react"
import MyComponent from "./MyComponent"
import Header from "./header"
import Footer from "./footer"
  
class App extends StreamlitComponentBase {
    render() {
      return(
        <div>
          <Header />
          <br style={{background : "black"}}/>
          <MyComponent />
          <br/>
          <Footer />
        </div>
      )
  
    }
}

export default withStreamlitConnection(App)
