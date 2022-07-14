import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import "./GraphSideBar.css"
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from "react-redux";
import { addNode, setIsLoadingTree,setLevel, removeEdges, assignUser, revokeUser } from "../redux/mainStore";
import UserRoleAssigner from "./UserRoleAssigner";
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar from '@mui/material/AppBar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MuiDrawer from '@mui/material/Drawer';
import {
  Accordion,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText, useTheme
} from "@mui/material";
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import axios from "axios"
import Tooltip,{ tooltipClasses } from '@mui/material/Tooltip';
import StyledListItemMenu from "./StyledListItemMenu";
import {StyledListItem} from "./StyledListItem";
import StyledBootstrapDialogTitle from "./StyledBootstrapDialogTitle";
import {ModalStyledButton} from "./ModalStyledButton";
import Swal from 'sweetalert2'
import ClipLoader from "react-spinners/ClipLoader";
import CreateRoleModal from './modals/CreateRoleModal';
import DropRoleModal from './modals/DropRoleModal';
import CreateWarehouseModal from './modals/CreateWarehouseModal';
import DropWarehouseModal from './modals/DropWarehouseModal';
import CreateUserModal from './modals/CreateUserModal';
import DropUserModal from './modals/DropUserModal';
import GrantPrivsModal from './modals/GrantPrivsModal';
import RevokePrivsModal from './modals/RevokePrivsModal';
import StyledListItemButton from './StyledListItemButton';
import ReplicatePrivsModal from './modals/ReplicatePrivsModal';


const AccordionSummary = styled((props) => (<MuiAccordionSummary
  expandIcon={<ArrowForwardIosSharpIcon sx={{fontSize: '0.9rem'}}/>}
  {...props}
/>))(({theme}) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));
const drawerWidth = 240;

const AccordionDetails = styled(MuiAccordionDetails)(({theme}) => ({
  padding: theme.spacing(2), borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
}));

// const BootstrapDialogTitle = (props) => {
// const { children, onClose, ...other } = props;

// return (
//     <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
//     {children}
//     {onClose ? (
//         <IconButton
//         aria-label="close"
//         onClick={onClose}
//         sx={{
//             position: 'absolute',
//             right: 8,
//             top: 8,
//             color: (theme) => theme.palette.grey[500],
//         }}
//         >
//         <CloseIcon />
//         </IconButton>
//     ) : null}
//     </DialogTitle>
// );
// };

// BootstrapDialogTitle.propTypes = {
// children: PropTypes.node,
// onClose: PropTypes.func.isRequired,
// };

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  background: "#072227",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
  background: "#072227",
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));


const GraphSideBar = ({getUsers, getWarehouses, allNodes, getAllNodes, getDisconnectedNodes, allUsers, handleDrawerOpen, handleDrawerClose, open, setOpen, warehouses, getNodes}) => {
  const theme = useTheme();

  const { nodes, edges } = useSelector(state=>state.mainSlice);
  const dispatch = useDispatch();

  const [openViewRole, setopenViewRole] = React.useState(false);
  const [openAddRole, setOpenAddRole] = React.useState(false);
  const [openAddEdge, setopenAddEdge] = React.useState(false);
  const [openAddWarehouse, setOpenAddWarehouse] = React.useState(false);
  const [openDropWarehouse, setOpenDropWarehouse] = React.useState(false);
  const [openRemoveEdge, setopenRemoveEdge] = React.useState(false);
  const [openGrantPrivs, setOpenGrantPrivs] = React.useState(false);
  const [openRevokePrivs, setOpenRevokePrivs] = React.useState(false);
  const [openReplicatePrivs, setOpenReplicatePrivs] = React.useState(false);
  const [roleName,setRoleName] = React.useState("");
  const [roleComments,setRoleComments] = React.useState(""); 
  const [selectedNode,setSelectedNode] = React.useState(null)
  const [hoveredNode,setHoveredNode] = React.useState(null)
  const [hoveredEdge,setHoveredEdge] = React.useState(null)
  const [danglingNodes,setDanglingNodes] = useState([])
  const [selectedNodeChildren,setSelectedNodeChildren] = useState([])
  const [selectedNodeParents,setSelectedNodeParents] = useState([])
  const [grantFrom, setGrantFrom] = useState(null);
  const [edgesToRevoke, setEdgesToRevoke] = useState([]);
  const [edgesToRevokeOptions, setEdgesToRevokeOptions] = useState([]);
  const [grantTo, setGrantTo] = useState(null);
  const [grantOptions,setGrantOptions] = useState([])
  const [independentRolesLoaded, setindependentRolesLoaded]=useState(true)
  const [grantToType, setGrantToType] = useState(null);
  const [revokeType, setRevokeType] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [usersToRevokeOptions, setUsersToRevokeOptions] = useState([]);
  const [warehouseName,  setWarehouseName] = useState(null);
  const [warehouseSize,  setWarehouseSize] = useState(null);
  const [warehouseRemoveName, setWarehouseRemoveName] = useState(null);
  const [roleRemoveName, setRoleRemoveName] = useState(null);
  // const [danglingNodes,setDanglingNodes] = useState([]);
  const [connectedNodes,setConnectedNodes] = useState([]);
  const [userName, setUserName] = useState("");
  const [userLoginName, setUserLoginName] = useState(null);
  const [userRemoveName, setUserRemoveName] = useState(null);
  const [openAddUser, setOpenAddUser] = useState(false);
  const [openDropUser, setOpenDropUser] = useState(false);
  const [openDropRole, setOpenDropRole] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = React.useState('panel1');
  const [revokeFrom, setRevokeFrom] = useState(null);
  const [revokeObject, setRevokeObject] = useState(null);
  const [revokeFromType, setRevokeFromType] = useState(null);
  
  const handleChangeAccordion = (panel) => (event, newExpanded) => {
    setExpandedAccordion(newExpanded ? panel : false);
  };

  const getIndependentRoles = () =>{
    setindependentRolesLoaded(false)
    axios({
      method: 'get',
      url: 'https://ldzg5qeyo4.execute-api.ap-south-1.amazonaws.com/dev/independent_roles/',
      // data: payload,
      headers: {
        // 'Authorization': `bearer ${token}`,
      'Content-Type': 'application/json'
      },
    })
    .then((response) => {
      console.log("Disconnected roles :", response.data);
      if(response.data.flag==1){
        setDanglingNodes(response.data["response"].map(r=>r["childRole"]))
      }
      setindependentRolesLoaded(true)
    })
    .catch((error) => {
      console.log(error)
      setindependentRolesLoaded(true)
      alert(error)
    })
  }

  useEffect(()=>{
    setGrantOptions(nodes.map(node=>{
      return({ value: node.label,label: node.label})
    }))
    setEdgesToRevokeOptions(edges.map(edge=>{
      return({ value: edge.label,label: edge.label})
    }))
    getIndependentRoles()
    setUsersToRevokeOptions(userRoles.map(userRole=>{
      return({value: userRole.user,label: userRole.user})
    }))
  },[nodes,edges])

  const nodeOnClick = (node)=>{
    console.log(node)
    setSelectedNode(node)
    setopenViewRole(true);
    var children = edges.filter(edge=>
      edge.source==node
    ).map(e=>e.target)
    console.log("Children are : ", children)
    setSelectedNodeChildren(children)
    var parents = edges.filter(edge=>
      edge.target==node
    ).map(e=>e.source)
    console.log("Parents are : ", parents)
    setSelectedNodeParents(parents)
  }

  const handleCloseViewRole = () => {
      setopenViewRole(false);
      setSelectedNode(null);
      setHoveredNode(null)
  };

  const handleCloseAddRole = () => {
      setOpenAddRole(false);
  };

  const handleCloseRevokeRole = () =>{
    setopenRemoveEdge(false)
    setRevokeFrom(null);
    setRevokeObject(null);
    setRevokeFromType(null);

  }

  const handleRevokeEdge = () =>{
      console.log("From : ", revokeFrom)
      console.log("To : ", revokeObject)
      console.log("Type : ", revokeFromType)

      axios({
          method: 'post',
          url: 'https://ldzg5qeyo4.execute-api.ap-south-1.amazonaws.com/dev/revoke_role/',
          data: {"data": ["SECURITYADMIN", [revokeObject.value], revokeFromType, [revokeFrom.value]]},
          headers: {
              // 'Authorization': `bearer ${token}`,
              'Content-Type': 'application/json'
          },
      })
          .then((response) => {
              console.log("Revoke role response :", response);
              Swal.fire({
                title: response.data.response,
                customClass: 'swal_alert__box',
                position:"center",
                icon: response.data.flag==1?'success':'error',
                confirmButtonText: 'Okay',
                timer:'2000',
                timerProgressBar:true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })
              if(response.data.flag==1){
                dispatch(setIsLoadingTree(true));
                getNodes().then(()=>{
                  getDisconnectedNodes().then(()=>{
                    dispatch(setIsLoadingTree(false));
                  })
                });
              }
          })
          .catch((error) => {
              console.log(error)
              alert(error)
              setIsLoadingTree(false)
          })
      setopenAddEdge(false);
  }

  const handleCloseAddEdge = () => {
      setopenAddEdge(false);
  };

  const createRoleClicked = () =>{
      setOpenAddRole(true);
      console.log("Clicked on add role")
      setRoleName("");
      setRoleComments("");
  }


  const displayParentsOrChildren = (nodesArray)  => nodesArray.map(node=>{
    return(
      <Typography gutterBottom>
          {node}
        </Typography>
    )
  })

  const createWarehouseClicked = () => {
    setOpenAddWarehouse(true);
    console.log("Clicked on add warehouse")
    setWarehouseName("");
    setWarehouseSize("");
  }

  const dropWarehouseClicked = () => {
      setOpenDropWarehouse(true);
  }

  const createUserClicked = () => {
      setOpenAddUser(true);
      console.log("Clicked on add user")
      setUserName("");
      setUserLoginName("");
  }

  const dropUserClicked = () => {
      setOpenDropUser(true);
      setUserRemoveName("");
  }

  const grantPrivsClicked = () => {
    setOpenGrantPrivs(true);
  }

  const revokePrivsClicked = () => {
    setOpenRevokePrivs(true);
  }

  const replicatePrivsClicked = () => {
    setOpenReplicatePrivs(true);
  }

  const revokeRoleClicked = () =>{
    setopenRemoveEdge(true);
  }

  const dropRoleClicked = () =>{
    setOpenDropRole(true);
  }

  const grantRoleClicked = () =>{
    setopenAddEdge(true);
    // console.log("Clicked on add role")
    // setRoleName("");
    // setRoleComments("");
  }
  //todo - remove AcountAdmin from options in child of an edge
  const handleAddEdge = () =>{
    console.log("From : ", grantFrom)
    console.log("To : ", grantTo)
    console.log("Type : ", grantToType)

    if(grantToType=="ROLE"){
      axios({
        method: 'post',
        url: 'https://ldzg5qeyo4.execute-api.ap-south-1.amazonaws.com/dev/grant_role_to_role/',
        data: {"data": ["SECURITYADMIN", grantFrom.value, grantTo.value]},
        headers: {
          // 'Authorization': `bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        console.log("Grant role to role response :", response);
        Swal.fire({
          title: response.data.response,
          customClass: 'swal_alert__box',
          position:"center",
          icon: response.data.flag==1?'success':'error',
          confirmButtonText: 'Okay',
          timer:'2000',
          timerProgressBar:true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        if(response.data.flag==1){
          dispatch(setIsLoadingTree(true));
          getNodes().then(()=>{
            getDisconnectedNodes().then(()=>{
              dispatch(setIsLoadingTree(false));
            })
          });
        }
      })
      .catch((error) => {
        console.log(error)
        alert(error)
        setIsLoadingTree(false)
      })
    }
    else{
      axios({
        method: 'post',
        url: 'https://ldzg5qeyo4.execute-api.ap-south-1.amazonaws.com/dev/grant_role_to_user/',
        data: {"data": ["SECURITYADMIN", grantFrom.map(v=>v.value), grantTo.map(v=>v.value)]},
        headers: {
          // 'Authorization': `bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })
      .then((response) => {
        console.log("Grant role to user response :", response);
        dispatch(setIsLoadingTree(true));
        getNodes().then(()=>{
          getDisconnectedNodes().then(()=>{
            dispatch(setIsLoadingTree(false));
          })
        });
      })
      .catch((error) => {
        console.log(error)
        alert(error)
        setIsLoadingTree(false)
      })
    }
    setopenAddEdge(false);
  }

  const handleGrantRoleTypeChange = (event) => {
    setGrantToType(event.target.value);
  };

  const handleCloseAddUser = () => {
      setOpenAddUser(false);
  };

  const handleCloseDropUser = () => {
      setOpenDropUser(false);
  };

  const handleCloseGrantPrivs = () => {
    setOpenGrantPrivs(false);
  };

  const handleCloseRevokePrivs = () => {
    setOpenRevokePrivs(false);
  };

  const handleCloseReplicatePrivs = () => {
    setOpenReplicatePrivs(false);
  };

  const handleCloseAddWarehouse = () => {
    setOpenAddWarehouse(false);
  };

  const handleCloseDropWarehouse = () => {
      setOpenDropWarehouse(false);
  };

  const handleCloseDropRole = () => {
    setOpenDropRole(false);
  };


  const handleChangeRevokeFromType = (event) => {
      console.log(event.value)
      setRevokeFromType(event.value);
      getAllNodes()
  }

  const handleChangeGrantToType = (event) => {
      console.log(event.value)
      setGrantToType(event.value);
      getAllNodes()
  }

  const getRolesOfNode = ( nodeName ) => {
    var children = []
      var node = nodes.filter(n=>n.label==nodeName)[0]
    nodes.forEach(n=>{
      if(edges.filter(e=>e.source==node.label && e.target==n.label).length>0){
        children.push(n)
      }
    })
    return children
  }
  const getUsersOfNode = ( role ) => {
      // call /get_users_of_role with "role_name" as parameter
      var users = []
      axios({
        method: 'post',
        url: 'https://ldzg5qeyo4.execute-api.ap-south-1.amazonaws.com/dev/get_users_of_role/',
        data: { "data":[
            role.value
          ]}
        ,
        headers: {
          // 'Authorization': `bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })
        .then((response) => {
          console.log("Get Users response :", response);
          users = response.data.data
        })
        .catch((error) => {
          console.log(error)
          alert(error)
          alert("Users Not Found")
        })
      console.log(users);
      return users;
  }
  const  getParentsOfNode = (node)=>{
    var parents = []
    nodes.forEach(n=>{
        // console.log(getRolesOfNode(n.label).map((node)=>node))
      if(getRolesOfNode(n.label).map((node)=>node.label).includes(node)){
        parents.push(n.label)
      }
    })
    return parents
  };

  return (
      <>
        <Drawer
          variant="permanent"
          open={open}
        >
          <DrawerHeader>

          </DrawerHeader>
          <Divider />
          <div className='sidebar' style={{display:"flex", flexDirection:"column", height:"90vh"}}>
            <div 
            // style={{overflow:"scroll"
            //   // , flex: 0.6
            // }}
            >
            <List sx={{padding: 0}}>
              <StyledListItemMenu onClick={open ?handleDrawerClose:handleDrawerOpen}>
                <StyledListItemButton>
                  <ListItemIcon>
                    {
                      open ? <ChevronLeftIcon sx={{ color: "#AEFEFF" }}/> : <ChevronRightIcon sx={{ color: "#AEFEFF" }}/>
                    }
                  </ListItemIcon>
                  <ListItemText primary="" sx={{color: "#AEFEFF"}}/>
                </StyledListItemButton>
              </StyledListItemMenu>
              {open ?
              <>
              <StyledListItemMenu onClick={createRoleClicked}>
                  <StyledListItemButton>
                    <ListItemIcon>
                      <AddCircleIcon sx={{ color: "#AEFEFF" }} />
                    </ListItemIcon>
                    <ListItemText primary="Create Role" sx={{color: "#AEFEFF"}}/>
                  </StyledListItemButton>
              </StyledListItemMenu>
              <StyledListItemMenu onClick={dropRoleClicked}>
                <StyledListItemButton>
                  <ListItemIcon>
                    <LinkOffIcon sx={{ color: "#AEFEFF" }} />
                  </ListItemIcon>
                  <ListItemText primary="Drop Role" sx={{color: "#AEFEFF"}}/>
                </StyledListItemButton>
              </StyledListItemMenu>
              <StyledListItemMenu onClick={grantRoleClicked}>
                <StyledListItemButton>
                  <ListItemIcon>
                    <LinkIcon sx={{ color: "#AEFEFF" }} />
                  </ListItemIcon>
                  <ListItemText primary="Grant Role" sx={{color: "#AEFEFF"}}/>
                </StyledListItemButton>
              </StyledListItemMenu>
              <StyledListItemMenu onClick={revokeRoleClicked}>
                <StyledListItemButton>
                  <ListItemIcon>
                    <LinkOffIcon sx={{ color: "#AEFEFF" }} />
                  </ListItemIcon>
                  <ListItemText primary="Revoke Role" sx={{color: "#AEFEFF"}}/>
                </StyledListItemButton>
              </StyledListItemMenu>
              <StyledListItemMenu onClick={createWarehouseClicked}>
                  <StyledListItemButton>
                      <ListItemIcon>
                          <LinkOffIcon sx={{ color: "#AEFEFF" }} />
                      </ListItemIcon>
                      <ListItemText primary="Create Warehouse" sx={{color: "#AEFEFF"}}/>
                  </StyledListItemButton>
              </StyledListItemMenu>
              <StyledListItemMenu onClick={dropWarehouseClicked}>
                  <StyledListItemButton>
                      <ListItemIcon>
                          <LinkOffIcon sx={{ color: "#AEFEFF" }} />
                      </ListItemIcon>
                      <ListItemText primary="Drop Warehouse" sx={{color: "#AEFEFF"}}/>
                  </StyledListItemButton>
              </StyledListItemMenu>
              <StyledListItemMenu onClick={createUserClicked}>
                <StyledListItemButton>
                  <ListItemIcon>
                    <PersonAddIcon sx={{ color: "#AEFEFF" }} />
                  </ListItemIcon>
                  <ListItemText primary="Create User" sx={{color: "#AEFEFF"}}/>
                </StyledListItemButton>
              </StyledListItemMenu>
              <StyledListItemMenu onClick={dropUserClicked}>
                <StyledListItemButton>
                  <ListItemIcon>
                    <PersonRemoveIcon sx={{ color: "#AEFEFF" }} />
                  </ListItemIcon>
                  <ListItemText primary="Drop User" sx={{color: "#AEFEFF"}}/>
                </StyledListItemButton>
              </StyledListItemMenu>
              <StyledListItemMenu onClick={grantPrivsClicked}>
                <StyledListItemButton>
                  <ListItemIcon>
                    <PersonRemoveIcon sx={{ color: "#AEFEFF" }} />
                  </ListItemIcon>
                  <ListItemText primary="Grant Privileges" sx={{color: "#AEFEFF"}}/>
                </StyledListItemButton>
              </StyledListItemMenu>
              <StyledListItemMenu onClick={revokePrivsClicked}>
                <StyledListItemButton>
                  <ListItemIcon>
                    <PersonRemoveIcon sx={{ color: "#AEFEFF" }} />
                  </ListItemIcon>
                  <ListItemText primary="Revoke Privileges" sx={{color: "#AEFEFF"}}/>
                </StyledListItemButton>
              </StyledListItemMenu>
              <StyledListItemMenu onClick={replicatePrivsClicked}>
                <StyledListItemButton>
                  <ListItemIcon>
                    <PersonRemoveIcon sx={{ color: "#AEFEFF" }} />
                  </ListItemIcon>
                  <ListItemText primary="Replicate Privileges" sx={{color: "#AEFEFF"}}/>
                </StyledListItemButton>
              </StyledListItemMenu>
              </>
              :
              <>
              <HtmlTooltip title="Create Role" placement="right">
              <StyledListItemMenu onClick={createRoleClicked}>
                  <StyledListItemButton>
                    <ListItemIcon>
                      <AddCircleIcon sx={{ color: "#AEFEFF" }} />
                    </ListItemIcon>
                    <ListItemText primary="Create Role" sx={{color: "#AEFEFF"}}/>
                  </StyledListItemButton>
              </StyledListItemMenu>
              </HtmlTooltip>
              <HtmlTooltip title="Drop Role" placement="right"> 
              <StyledListItemMenu onClick={dropRoleClicked}>
                <StyledListItemButton>
                  <ListItemIcon>
                    <LinkOffIcon sx={{ color: "#AEFEFF" }} />
                  </ListItemIcon>
                  <ListItemText primary="Drop Role" sx={{color: "#AEFEFF"}}/>
                </StyledListItemButton>
              </StyledListItemMenu>
              </HtmlTooltip>
              <HtmlTooltip title="Grant Role" placement="right">
              <StyledListItemMenu onClick={grantRoleClicked}>
                <StyledListItemButton>
                  <ListItemIcon>
                    <LinkIcon sx={{ color: "#AEFEFF" }} />
                  </ListItemIcon>
                  <ListItemText primary="Grant Role" sx={{color: "#AEFEFF"}}/>
                </StyledListItemButton>
              </StyledListItemMenu>
              </HtmlTooltip>
              <HtmlTooltip title="Revoke Role" placement="right">
              <StyledListItemMenu onClick={revokeRoleClicked}>
                <StyledListItemButton>
                  <ListItemIcon>
                    <LinkOffIcon sx={{ color: "#AEFEFF" }} />
                  </ListItemIcon>
                  <ListItemText primary="Revoke Role" sx={{color: "#AEFEFF"}}/>
                </StyledListItemButton>
              </StyledListItemMenu>
              </HtmlTooltip>
              <HtmlTooltip title="Create Warehouse" placement="right">
              <StyledListItemMenu onClick={createWarehouseClicked}>
                  <StyledListItemButton>
                      <ListItemIcon>
                          <LinkOffIcon sx={{ color: "#AEFEFF" }} />
                      </ListItemIcon>
                      <ListItemText primary="Create Warehouse" sx={{color: "#AEFEFF"}}/>
                  </StyledListItemButton>
              </StyledListItemMenu>
              </HtmlTooltip>
              <HtmlTooltip title="Drop Warehouse" placement="right">
              <StyledListItemMenu onClick={dropWarehouseClicked}>
                  <StyledListItemButton>
                      <ListItemIcon>
                          <LinkOffIcon sx={{ color: "#AEFEFF" }} />
                      </ListItemIcon>
                      <ListItemText primary="Drop Warehouse" sx={{color: "#AEFEFF"}}/>
                  </StyledListItemButton>
              </StyledListItemMenu>
              </HtmlTooltip>
              <HtmlTooltip title="Create User" placement="right">
              <StyledListItemMenu onClick={createUserClicked}>
                <StyledListItemButton>
                  <ListItemIcon>
                    <PersonAddIcon sx={{ color: "#AEFEFF" }} />
                  </ListItemIcon>
                  <ListItemText primary="Create User" sx={{color: "#AEFEFF"}}/>
                </StyledListItemButton>
              </StyledListItemMenu>
              </HtmlTooltip>
              <HtmlTooltip title="Drop User" placement="right">
              <StyledListItemMenu onClick={dropUserClicked}>
                <StyledListItemButton>
                  <ListItemIcon>
                    <PersonRemoveIcon sx={{ color: "#AEFEFF" }} />
                  </ListItemIcon>
                  <ListItemText primary="Drop User" sx={{color: "#AEFEFF"}}/>
                </StyledListItemButton>
              </StyledListItemMenu>
              </HtmlTooltip>
              <HtmlTooltip title="Grant Privileges" placement="right">
              <StyledListItemMenu onClick={grantPrivsClicked}>
                <StyledListItemButton>
                  <ListItemIcon>
                    <PersonRemoveIcon sx={{ color: "#AEFEFF" }} />
                  </ListItemIcon>
                  <ListItemText primary="Grant Privileges" sx={{color: "#AEFEFF"}}/>
                </StyledListItemButton>
              </StyledListItemMenu>
              </HtmlTooltip>
              <HtmlTooltip title="Revoke Privileges" placement="right">
              <StyledListItemMenu onClick={revokePrivsClicked}>
                <StyledListItemButton>
                  <ListItemIcon>
                    <PersonRemoveIcon sx={{ color: "#AEFEFF" }} />
                  </ListItemIcon>
                  <ListItemText primary="Revoke Privileges" sx={{color: "#AEFEFF"}}/>
                </StyledListItemButton>
              </StyledListItemMenu>
              </HtmlTooltip>
              <HtmlTooltip title="Replicate Privileges" placement="right">
              <StyledListItemMenu onClick={replicatePrivsClicked}>
                <StyledListItemButton>
                  <ListItemIcon>
                    <PersonRemoveIcon sx={{ color: "#AEFEFF" }} />
                  </ListItemIcon>
                  <ListItemText primary="Replicate Privileges" sx={{color: "#AEFEFF"}}/>
                </StyledListItemButton>
              </StyledListItemMenu>
              </HtmlTooltip>
              </>
              }
            </List>
            </div>           
          </div>

        </Drawer>
        <div id="sidebar">
          {/* create role */}
          <CreateRoleModal openAddRole={openAddRole} setOpenAddRole={setOpenAddRole} handleCloseAddRole={handleCloseAddRole} getDisconnectedNodes={getDisconnectedNodes} getAllNodes={getAllNodes} getNodes={getNodes} />
            {/* grant role to role/user */}
          <BootstrapDialog
            onClose={handleCloseAddEdge}
            aria-labelledby="customized-dialog-title"
            open={openAddEdge}
            PaperProps={{
              style: {
                width:"500px", height:"400px"
              },
            }}
          >
            <StyledBootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseAddEdge} sx={{backgroundColor: "#072227",}}>
              Grant Role
            </StyledBootstrapDialogTitle>
            <DialogContent dividers>
              <div>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center" ,margin:"12px"}}>
                  <div>
                    <p>Type</p>
                    <div style={{width: "100px"}}>
                      <Select
                      isClearable 
                      defaultValue={grantToType}
                      onChange={handleChangeGrantToType}
                      options={[{value: "ROLE", label: "ROLE"}, {value: "USER", label: "USER"}]}
                      />
                      </div>
                  </div>
                  <div>
                    <p>Grant</p>
                    <div style={{width: "300px"}}>
                    <Select isClearable
                      isMulti={grantToType=="USER"}
                      onChange={setGrantFrom}
                      options={grantTo ? allNodes.filter(option => option.value !== grantTo.value && !["SysAdmin", "UserAdmin", "SecurityAdmin", "AccountAdmin"].includes(option.value)) : allNodes.filter(option => !["SysAdmin", "UserAdmin", "SecurityAdmin", "AccountAdmin"].includes(option.value))}
                    />
                    </div>
                    <p>To</p>
                    <div style={{width: "300px"}}>
                    <Select isClearable
                      isMulti={grantToType=="USER"}
                      onChange={setGrantTo}
                      options={(grantToType === null) ? []
                        : ((grantToType === "ROLE")
                          ? (grantFrom
                                  ? allNodes.filter(option => option.value !== grantFrom.value)
                                  : allNodes) : allUsers.map(user => ({value: user.NAME, label: user.NAME})))}
                    />
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
            <DialogActions sx={{backgroundColor: "white",}}>
              <ModalStyledButton autoFocus onClick={handleCloseAddEdge} type="cancel">
                Cancel
              </ModalStyledButton>
              <ModalStyledButton autoFocus onClick = {handleAddEdge} type="confirm">
                Add
              </ModalStyledButton>
            </DialogActions>
          </BootstrapDialog>
          {/* revoke role from role/user */}
          <BootstrapDialog
            onClose={handleCloseRevokeRole}
            aria-labelledby="customized-dialog-title"
            open={openRemoveEdge}
            PaperProps={{
              style: {
                width:"500px", height:"400px"
              },
            }}
          >
            <StyledBootstrapDialogTitle id="customized-dialog-title" onClose={handleCloseRevokeRole}>
              Revoke Role
            </StyledBootstrapDialogTitle>
            <DialogContent dividers>
                <div>
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center" ,margin:"12px"}}>
                        <div>
                            <p>Type</p>
                            <div style={{width: "100px"}}>
                            <Select isClearable
                                defaultValue={revokeFromType}
                                onChange={handleChangeRevokeFromType}
                                options={[{value: "ROLE", label: "ROLE"}, {value: "USER", label: "USER"}]}
                            />
                            </div>
                        </div>
                        <div>
                            <p>Revoke</p>
                            <div style={{width: "300px"}}>
                              <Select isClearable
                                  onChange={setRevokeObject}
                                  displayEmpty
                                  options={(!(revokeFrom === null || revokeFrom === "") ?
                                      allNodes.filter(option => option.value !== revokeFrom.value && !["SYSADMIN", "USERADMIN", "SECURITYADMIN", "ACCOUNTADMIN"].includes(option.value)).filter(option => !danglingNodes.includes(option.value)).filter(option => getRolesOfNode(revokeFrom.value).map((value) => value.label).includes(option.value))
                                      : allNodes.filter(option => !["SYSADMIN", "USERADMIN", "SECURITYADMIN", "ACCOUNTADMIN"].includes(option.value)).filter(option => !danglingNodes.includes(option.value)))

                                  }
                              />
                            </div>
                            <p>From</p>
                            <div style={{width: "100px"}}>
                              <Select isClearable
                                  onChange={setRevokeFrom}
                                  displayEmpty
                                  options={(setRevokeFromType === null) ? [{value: "", label: ""}]
                                      : ((revokeFromType === "ROLE")
                                          ? (!(revokeObject === null || revokeObject === "")
                                              ? allNodes.filter(option => option.value !== revokeObject.value).filter(option => !danglingNodes.includes(option.value)).filter(option => getParentsOfNode(revokeObject.value).includes(option.value))
                                              : allNodes.filter(option => !danglingNodes.includes(option.value)))
                                          :
                                          (!(revokeObject === null || revokeObject === "")
                                                  ? allUsers.map(user => ({value: user.NAME, label: user.NAME}))
                                                      .filter(option => getUsersOfNode(revokeObject).includes(option))
                                                  : allUsers.map(user => ({value: user.NAME, label: user.NAME}))
                                          ))}
                              />
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions sx={{backgroundColor: "white",}}>
              <ModalStyledButton autoFocus onClick={handleCloseRevokeRole} type="cancel">
                Cancel
              </ModalStyledButton>
              <ModalStyledButton autoFocus onClick = {handleRevokeEdge} type="confirm">
                Revoke
              </ModalStyledButton>
            </DialogActions>
          </BootstrapDialog>
          {/* drop role */}
          <DropRoleModal openDropRole={openDropRole} setOpenDropRole={setOpenDropRole} handleCloseDropRole={handleCloseDropRole} allNodes={allNodes} getDisconnectedNodes={getDisconnectedNodes} getAllNodes={getAllNodes} getNodes={getNodes} />
          {/* create warehouse */}
          <CreateWarehouseModal openAddWarehouse={openAddWarehouse} setOpenAddWarehouse={setOpenAddWarehouse} handleCloseAddWarehouse={handleCloseAddWarehouse} getWarehouses={getWarehouses} />
          {/* drop warehouse */}
          <DropWarehouseModal openDropWarehouse={openDropWarehouse} handleCloseDropWarehouse={handleCloseDropWarehouse} warehouses={warehouses} setOpenDropWarehouse={setOpenDropWarehouse} getWarehouses={getWarehouses} />
          {/* create user */}
          <CreateUserModal openAddUser={openAddUser} handleCloseAddUser={handleCloseAddUser} setOpenAddUser={setOpenAddUser} getUsers={getUsers} />
          {/* drop user */}
          <DropUserModal openDropUser={openDropUser} handleCloseDropUser={handleCloseDropUser} setOpenDropUser={setOpenDropUser} allUsers={allUsers} getUsers={getUsers} />
          {/* grant privs */}
          <GrantPrivsModal openGrantPrivs={openGrantPrivs} handleCloseGrantPrivs={handleCloseGrantPrivs} setOpenGrantPrivs={setOpenGrantPrivs} allNodes={allNodes}/>
          {/* revoke privs */}
          <RevokePrivsModal openRevokePrivs={openRevokePrivs} handleCloseRevokePrivs={handleCloseRevokePrivs} setOpenRevokePrivs={setOpenRevokePrivs} allNodes={allNodes}/>
          {/* replicate privs */}
          <ReplicatePrivsModal openReplicatePrivs={openReplicatePrivs} handleCloseReplicatePrivs={handleCloseReplicatePrivs} setOpenReplicatePrivs={setOpenReplicatePrivs} allUsers={allUsers}/>
        </div>
      </>
  );
};

export default GraphSideBar;