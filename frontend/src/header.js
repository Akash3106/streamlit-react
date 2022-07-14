  import React, { Component } from "react";
import { StreamlitComponentBase, withStreamlitConnection } from "streamlit-component-lib";
  import caribou from "./caribou.png"
  
  
  class Header extends StreamlitComponentBase {
    render(){
      const jsonFileData = this.props.args["jsonFile"];
      var response = jsonFileData
      console.log(response.response)

    return (
        <nav className="navbar navbar-expand-lg " style={{color: "white", backgroundColor : "black"}} >
          <div className="container-fluid">
            <div className="navbar-brand">
              <img src={caribou} alt="" width="50" height="44" className="d-inline-block align-text-top"/>
              <span style={{color: "white"}}>CARIBOU</span>
            </div>
            <div className="collapse navbar-collapse" id="navbarNavDropdown" style={{position: "absolute" , right: 10}}>
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link active" style={{color: "white"}} aria-current="page" href="#">Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" style={{color: "white"}}  href="#">Features</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link active" style={{color: "white"}} href="#">Pricing</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
    );
  }
  }
  
  export default withStreamlitConnection(Header);