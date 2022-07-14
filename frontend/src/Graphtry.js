import React, { useEffect} from 'react';
import {
    Streamlit,
    StreamlitComponentBase,
    withStreamlitConnection,
  } from "streamlit-component-lib"
import { useDispatch, useSelector } from "react-redux";
import GraphSideBar from './components/GraphSideBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import GraphView from './components/GraphView';
class Graphtry extends StreamlitComponentBase {
    render() {
        const { nodes,edges, isLoadingTree } = useSelector(state=>state.mainSlice);
        const dispatch = useDispatch();



        const jsonFileData = this.props.args["jsonFile"];
        var response = jsonFileData
        console.log(response.response)
        const getNodes = async () =>{
            try {
                if (response.flag == 1) {
                  console.log("Nodes from flask :", response);
                  console.log(response.response)
                  const _edges = response.response.map(edge=>{
                    return({
                      "id":`${edge["PARENT_ROLE"]}_${edge["CHILD_ROLE"]}`,
                      "source":edge["PARENT_ROLE"],
                      "target":edge["CHILD_ROLE"],
                      "label":`${edge["PARENT_ROLE"]}_${edge["CHILD_ROLE"]}`
                    })
                  })
      
                  // dispatch(setEdges(_edges));
                  // setEdges(_edges)
                  const _nodes = response.response.map((edge) => {
                      return {"id": edge["CHILD_ROLE"], "label": edge["CHILD_ROLE"], "level": edge["LEVEL"]}
                  })
                  // loop through _nodes and check for duplicates and if there are duplicates keep the duplicate with the highest level
                  const _nodes_unique = _nodes.reduce((acc, curr) => {
                      if (!acc.some(node => node.id === curr.id)) {
                          acc.push(curr);
                      } else {
                          const index = acc.findIndex(node => node.id === curr.id);
                          if (acc[index].level < curr.level) {
                              acc[index] = curr;
                          }
                      }
                      return acc;
                  }, []);
                  console.log(_nodes)
                  console.log(_nodes_unique)
                  // dispatch(setNodes(_nodes_unique));
                }
                else {
                  alert("Request failed for rbac_hierarchy")
                  console.log(response.data)
                }
            }
            catch (error) {
              console.log(error)
              alert("error in rbac_hierarchy")
            }
        }

        const tabValue = "rbac";
        
        return (
            <div>
              <div style={{display:"flex" }}>
                <div style={{flex: 0.2}}>
                    <GraphSideBar getNodes={getNodes} />
                </div>
                <div className="nodes__div" style={{display: "flex", justifyContent: "center", flexDirection:"column",
                    // backgroundColor:"whitesmoke", 
                    alignItems:"center", width: "100%", marginTop:"100px"}}>
                  <Box sx={{ width: '100%' }}>
                    <Tabs
                      textColor="secondary"
                      indicatorColor="secondary"
                      aria-label="secondary tabs example"
                      centered
                    >
                      <Tab value="rbac" label="RBAC Hierarchy" />
                    </Tabs>
                  </Box>
                  {/* <div>
                    <Button onClick={generatePDF} variant="contained">Download</Button>
                  </div> */}
                  <div className="nodes__div" style={{display: "flex", justifyContent: "center",alignItems:"center", margin:"auto"}}>
                    {tabValue=="rbac" && nodes && edges && <GraphView  nodes={nodes} edges={edges} />}   
                  </div>
                </div>
              </div>

            </div>
        );
    }
}

export default withStreamlitConnection(Graphtry);