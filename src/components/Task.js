import React, { useState } from "react";
import Delete from "../images/deleteicon.png"
import Edit from "../images/editicon.png"

export default function Task(props) {

    const [status,setStatus] = useState(props.tasksDetail.status)
    function onDeleteClick() {
        fetch("/deleteTask",{
            method : "DELETE",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                taskId: props.tasksDetail._id,
            })
        })
        .then((res)=> res.text())
        .then((data) => {
            console.log("Success")
            window.location.reload();
        })
        .catch((err) => {
            console.log("Error :", err)
        })
    }
    const prio = props.tasksDetail.priority
    let styles = {}
    switch(prio) {
        case "High" : 
            styles = {
            fontWeight : "bold",
                color : "red"
            }
        break;
        case "Medium" : 
        styles = {
            fontWeight : "bold",
            color : "orange"
        }
        break;
        case "Low" : 
        styles = {
            fontWeight : "bold",
            color : "green"
        }
        break;
        default:
            console.log("something went wrong")
    }
    function handleStatus() {
        let newStatus = ""
        switch(status) {
            case "To Do" : 
                setStatus("In Progress")
                newStatus = "In Progress"
            break;
            case "In Progress" : 
                setStatus("Done")
                newStatus = "Done"

            break;
            case "Done" : 
                setStatus("To Do")
                newStatus = "To Do"
            break;
            default : 
            console.log("something went wrong")
        }
        fetch("/updateStatus", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              taskId: props.tasksDetail._id,
              newStatus : newStatus,
            }),
          })
            .then((response) => response.text())
            .then(() => {
              console.log("Success");
            })
            .catch((error) => {
              console.error("Error:", error);
            });
    }
    function edit() {
        fetch("/specTask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                taskId: props.tasksDetail._id
            })
        })
        .then((res) => res.json())
        .then((data) => {
            props.onEditTask(data);
        })
        .catch((err) => {
            console.log("Error: ", err);
        });
    }
    return (
        <div className="Task--Container">
            <div className="task--description">
                <p className="tasks--titles">Task</p>
                <p>{props.tasksDetail.message}</p>
            </div>
            <div className="task--priority">
                <p className="tasks--titles">Priority</p>
                <p style={styles}>{props.tasksDetail.priority}</p>
            </div>
            <div className="task--status">
                <p onClick={handleStatus}>{status}</p>
            </div>
            <div className="task--loader">
                <p>Loader</p>
            </div>
            <div className="task--buttons">
                <div className="task--button" onClick={edit}>
                    <img src={Edit} onClick={props.editActive} alt="ta"/>
                </div>
                <div className="task--button">
                    <img src={Delete} onClick={onDeleteClick} alt="ta"/>
                </div>
            </div>
        </div>
    )
}