import React, { useEffect, useState } from "react";
import Task from "./Task";

export default function Main() {
  const [addActive,setaddActive] = useState(false)
  const [editActive,seteditActive] = useState(false)
  const [high,setHigh] = useState(false)
  const [med,setMed] = useState(false)
  const [low,setLow] = useState(false)
  const [specTask, setSpecTask] = useState(null);
  const[data,setData] = useState({
    message : "",
    priority : "",
  })

  const prioritesList = ["High", "Medium", "Low"]
  const priortyArray = prioritesList.map((prio,index)=> {
    function handlePriotSelect() {
      switch(prio) {
        case "High" : 
        setData(prevData => {
          return{
            ...prevData,
            priority : "High"
          }
        })
        setHigh(prev => !prev)
        setMed(false)
        setLow(false)
        break;
        case "Medium" : 
        setData(prevData => {
          return{
            ...prevData,
            priority : "Medium"
          }
        })
        setMed(prev => !prev)
        setHigh(false)
        setLow(false)
        break;
        case "Low" : 
        setData(prevData => {
          return{
            ...prevData,
            priority : "Low"
          }
        })
        setLow(prev => !prev)
        setHigh(false)
        setMed(false)
        break;
        default:
          console.log("Something went wrong")
      }
    }
    let styles = {}
    switch(prio) {
      case "High" :
        styles = {
          color : high ? "white" : "red",
          borderColor : "red",
          backgroundColor : high ? "red" :"white"
        }
        break;
        case "Medium" :
        styles = {
          color : med ? "white" : "orange",
          borderColor : "orange",
          backgroundColor : med ? "orange" : "white"
        }
        break;
        case "Low" :
        styles = {
          color : low ? "white" : "green",
          borderColor : "green",
          backgroundColor: low ? "green" : "white"
        }
        break;
        default :
        console.log("Something went wrong")
    }
    return(
      <p
        key={index}
        style={styles}
        onClick={handlePriotSelect}
        >
        {prio}
      </p>
    )
  })
  function handleEditActive() {
    seteditActive(prev => !prev)
  }

  const [tasks,setTasks] = useState([])
  useEffect(()=> {
    fetch("/taskList")
        .then(res=>res.json())
        .then(data=>setTasks(data))
    },[])
    function handleChange(e) {
      console.log(data)
      const { value, name } = e.target;
        setData(prevData => ({
          ...prevData,
          [name]: value
        }));
    }

    function addTask() {
      fetch("/addTask", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: data.message,
            priority: data.priority
        })
    })
    .then((res) => res.json())
    .then(() => {
        console.log("Task Added")
        window.location.reload();

    })
    .catch((err) => {
        console.log("Error: ", err);
    });
    }
    function handleEditTaskReceived(data) {
      setSpecTask(data);
    }
    const tasksArray = tasks.map((task,i) => {
      return(
          <Task
            key={i}
            tasksDetail = {task}
            editActive={handleEditActive}
            onEditTask = {handleEditTaskReceived}
          />
      )
    })
    function editTask() {
      console.log(data)
      const updatedTaskData = {
        taskId: specTask._id,
        message: data.message,
        priority: data.priority,
      };
    
      fetch("/editTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTaskData),
      })
        .then((response) => response.text())
        .then(() => {
          console.log("Success");
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
      return (
        <div className="Container">
           <div className="Header">
              <h1>Task List</h1>
              <button onClick={() => setaddActive(prevActive => !prevActive)}>+ Add Task</button>
           </div>
           <div className="tasksList">
              {tasksArray}
             
           </div>
           <div className="Add--Task--Container" style={{ display: addActive ? "block" : "none" }}>
                <div className="add--task--header">
                  <h1>Add task</h1>
                  <p onClick={() => setaddActive(false)}>X</p>
                </div>
                <div className="add--task--input">
                  <h2>Task</h2>
                  <input 
                    placeholder="Type your task here..."
                    onChange={handleChange}
                    value={data.message}
                    required
                    name="message"
                    />
                </div>
                <div className="add--task--priorites">
                  <h2>Priority</h2>
                  <div className="priority--list">
                    {priortyArray}
                  </div>
                </div>
                <button onClick={addTask}>Add</button>
           </div>
           <div className="Add--Task--Container" style={{ display: editActive ? "block" : "none" }}>
              <div className="add--task--header">
                <h1>Edit task</h1>
                <p onClick={() => seteditActive(false)}>X</p>
              </div>
              <div className="add--task--input">
                <h2>Task</h2>
                <input 
                   placeholder="Type your task here..."
                    onChange={handleChange}
                    value={data.message}
                    required
                    name="message"
                />
              </div>
              <div className="add--task--priorites">
                <h2>Priority</h2>
                <div className="priority--list">
                  {priortyArray}
                </div>
              </div>
              <button style={{backgroundColor:"#713FFF"}} onClick={editTask}>Edit</button>
           </div>
        </div>
    )
}