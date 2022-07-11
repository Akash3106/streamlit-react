import os
import streamlit.components.v1 as components
 
_RELEASE = False
if not _RELEASE:
     _component_func = components.declare_component("my_component",url="http://localhost:3001/")
     footer_func = components.declare_component("footer_component" , url="http://localhost:3001/foot")
     midComp_func = components.declare_component("main_component" , url="http://localhost:3001/midcomponent")
else:
     parent_dir = os.path.dirname(os.path.abspath(_file_))
     build_dir = os.path.join(parent_dir, "frontend/build")
     _component_func = components.declare_component("my_component", path=build_dir)
 
 
def my_component(key=None):
     component_value = _component_func( key=key, default=0)
     return component_value

def footer_component(key=None):
     component_value = footer_func(key=key, default=0)
     return component_value

def main_component():
     component_value = midComp_func()
     return component_value

 
if not _RELEASE:
     import streamlit as st
     st.set_page_config(layout="wide")
     st.markdown("""
         <style>
                .css-18e3th9 {
                     padding-top: 0rem;
                     padding-bottom: 0rem;
                     padding-left: 0rem;
                     padding-right: 0rem;
                 }
                .css-1d391kg {
                     padding-top: 0rem;
                     padding-right: 0rem;
                     padding-bottom: 0rem;
                     padding-left: 0rem;
                 }
                 #MainMenu {visibility: hidden;}
                 header {visibility: hidden;}
                 footer {visibility : hidden;}
                 body{ background : "black";}
 
         </style>
         """, unsafe_allow_html=True)

     my_component()
     main_component()
     footer_component()

     