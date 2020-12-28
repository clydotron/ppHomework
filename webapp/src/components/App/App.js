import React, {useState, useEffect } from 'react';
//import logo from './../../../assets/images/pp_logo.svg';
import './App.css';
import TitleBar from '../TitleBar/TitleBar';
import Workspace from '../Workspace/Workspace';
import API from './../API/API';

function App() {

  const [title,setTitle] = useState("none");
  const [workspace,setWorkspace] = useState({id: "536f710fc55b2acc61000bc9"}); //@todo do something about this
  const [loaded,setLoaded] = useState(false)
  
  //

  const handleNewTitle = (newTitle) => {
    setTitle(newTitle)
    console.log(`>>> newTitle:${newTitle}`)

    const data = {
      ...workspace,
      title: newTitle
    }
    API.patch(`workspace/${workspace.id}`,JSON.stringify(data))
    .then(resp => {console.log(`success:${resp}`) })
    .catch(resp => { console.log(`failure: ${resp}`)})
  }

  useEffect( () => {

    // add logic to conditionally create the workspace if doesnt already exist
    API.get(`workspace/default`)
    .then( resp => {
      console.log("default:",resp.data)
 
    })

    API.get(`workspace/${workspace.id}`)
    .then( resp => {

      console.log("Loaded workspace: ",resp.data)

      // const workspaceX = {
      //   title: resp.data.title,
      //   roadmap: resp.data.roadmap,
      //   id: resp.data.id
      // }
      const newWorkspace = resp.data

      setTitle(newWorkspace.title)
      setWorkspace(newWorkspace)
      setLoaded(true)
    })
    .catch( resp => console.log(resp))
  }
,[workspace.id])

  return (
    <div className="App">
      {
        loaded &&
        <div className="AppContainer">
          <TitleBar title={title} handleNewTitle={handleNewTitle.bind(this)}/>
          <Workspace workspace={workspace}/>
        </div>
      }
    </div>
  );
}

export default App
