import logo from "./KIPI-Logo.webp";
import React,  { Component } from 'react';


class Footer extends Component {
    render(){
  return (
    <div style={{background: "black" , color: "white"}}   className='text-center text-lg-start text-muted'>
    <section  className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
        <div  style={{color: "white"}} className='me-5 d-none d-lg-block'>
          <span>Social Media Handel</span>
        </div>

        <div>
          <a href='' className='me-4 text-reset'>
            <i className='fab fa-facebook-f'></i>
          </a>
          <a href='' className='me-4 text-reset'>
            <i className='fab fa-twitter'></i>
          </a>
          <a href='' className='me-4 text-reset'>
            <i className='fab fa-google'></i>
          </a>
          <a href='' className='me-4 text-reset'>
            <i className='fab fa-instagram'></i>
          </a>
          <a href='' className='me-4 text-reset'>
            <i className='fab fa-linkedin'></i>
          </a>
          <a href='' className='me-4 text-reset'>
            <i className='fab fa-github'></i>
          </a>
        </div>
      </section>

      <section  style={{color: "white"}} className=''>
        <div className='container text-center text-md-start mt-5'>
          <div className='row mt-3'>
            <div className='col-md-3 col-lg-4 col-xl-3 mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>
                <i className='fas fa-gem me-3'></i>
                <img src={logo} />
              </h6>
              <p>
                Here you can use rows and columns to organize your footer content. Lorem ipsum dolor sit amet,
                consectetur adipisicing elit.
              </p>
            </div>

            <div  style={{color: "white"}} className='col-md-2 col-lg-2 col-xl-2 mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Products</h6>
              <p>
                <a href='#!' className='text-reset'>
                  Project1
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                Project2
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                Project3
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                Project4
                </a>
              </p>
            </div>

            <div  style={{color: "white"}} className='col-md-3 col-lg-2 col-xl-2 mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Useful links</h6>
              <p>
                <a href='#!' className='text-reset'>
                  Pricing
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Settings
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Orders
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Help
                </a>
              </p>
            </div>

            <div style={{color: "white"}} className='col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
              <p>
                <i className='fas fa-home me-3'></i> New York, NY 10012, US
              </p>
              <p>
                <i className='fas fa-envelope me-3'></i>
                info@example.com
              </p>
              <p>
                <i className='fas fa-phone me-3'></i> + 01 234 567 88
              </p>
              <p>
                <i className='fas fa-print me-3'></i> + 01 234 567 89
              </p>
            </div>
          </div>
        </div>
    </section>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' , color: "white"}}>
        © 2022 Copyright:
        <a className='text-reset fw-bold' href='https://kipi.bi/' target={"_blank"}>
          Kipi.bi
        </a>
      </div>
    </div>
  );
}
}

export default Footer;