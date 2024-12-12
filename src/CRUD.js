import { useState, useEffect, Fragment } from "react";
import { Table } from "react-bootstrap";
import React, { useRef } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import 'bootstrap/dist/css/bootstrap.min.css'

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from "axios";

import { toast, ToastContainer, Tost } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
// import "react-toastify/ReactToastify.min.css"


const CRUD = () => {
    const empData = [
        {
            id: 1,
            name: "Manoj",
            age: 23,
            isActive: 1
        },
        {
            id: 2,
            name: "dev",
            age: 18,
            isActive: 1
        },
        {
            id: 3,
            name: "sujal",
            age: 21,
            isActive: 1
        },
        {
            id: 4,
            name: "amir",
            age: 45,
            isActive: 1
        },
        {
            id: 5,
            name: "paji",
            age: 35,
            isActive: 1
        }
    ]

    const [data, setData] = useState([]);
    
    const inputRef = useRef(null);

    useEffect(() => {
        getData();       
        if(inputRef.current){
            inputRef.current.focus();
        }
    }, []);

    const [show, setShow] = useState(false);

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [isActive, setIsActive] = useState(0);

    const [editId, setEditId] = useState(0);
    const [editName, setEditName] = useState('');
    const [editAge, setEditAge] = useState('');
    const [editIsActive, setEditIsActive] = useState(0);


    const handleClose = () => setShow(false);

    const handleShow = () => {
        setShow(true);  
        setTimeout(() => {
            if(inputRef.current){
                inputRef.current.focus();
            }
        }, 0)
      
    }

    const handleUpdate = () => {

        const UpdatedData = {
            "id" : editId,
            "name" : editName,
            "age" : editAge,
            "isActive" : editIsActive
        }

        axios.put(`https://localhost:7039/v1/EmployeeAPI/UpdateEmployee/${editId}`, UpdatedData)
            .then(result => {
                if(result.status === 200){
                    getData();
                    toast.success("Employee Updated Successfully")
                }
            })
            .catch(error => toast.error(error));

        handleClose();
    }

    const handleSave = () => {
        const url = "https://localhost:7039/v1/EmployeeAPI/AddEmployee";
        const data = {
            "name": name,
            "age": age,
            "isActive": isActive
        }

        axios.post(url, data)
            .then(result => {
                getData();
                clear();
                toast.success("Employee has been Added");
            }).catch(error => toast.error(error))

    }

    const clear = () => {
        setEditId("");
        setName("");
        setAge("");
        setIsActive(0);
        setEditAge("");
        setEditName("");
        setEditIsActive(0);
    }

    const handleEdit = (id) => {
        handleShow();
        axios.get(`https://localhost:7039/v1/EmployeeAPI/GetEmployee/${id}`)
        .then(result => result.data)
        .then(data => {
            setEditId(data.id);
            setEditName(data.name);
            setEditAge(data.age);
            setEditIsActive(data.isActive);
        })
        .catch(error => console.log(error))        
    }

    const getData = () => {
        axios.get("https://localhost:7039/v1/EmployeeAPI/GetEmployees")
            .then(result => setData(result.data))
            .catch(error => console.log(error))
    }

    const handleDelete = (id) => {
        if (window.confirm("Are you sure to delete this employee")) {            
            
            axios.delete(`https://localhost:7039/v1/EmployeeAPI/Delete/${id}`)
                .then(result => {
                    if(result.status === 204){
                        getData();
                        toast.success("Employee has been Deleted");
                    }
                }).catch(error =>                 
                    toast.error(error));
        }

    }

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData('text/plain', index);
    };

    const handleDrop = (e, index) => {
        const draggedIndex = e.dataTransfer.getData('text/plain');
        const updatedItems = [...data];        
        
        const [movedItem] = updatedItems.splice(draggedIndex, 1);
        updatedItems.splice(index, 0, movedItem);
        axios.put("https://localhost:7039/v1/EmployeeAPI/UpdateDisplayOrder", updatedItems)
        setData(updatedItems);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const filter = () => {        
        if(name === '' && age === ''){
            getData();
        }else{
            const filteredData = data.filter(record => record.name === name || record.age === age || record.isActive === isActive);
            setData(filteredData);
        }
    }    

    return (
        <Fragment>
            <ToastContainer/>

            <Container>
                <Row>
                    <Col>
                        <input  ref={inputRef} type="text" className="form-control" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)} />
                    </Col>
                    <Col>
                        <input type="text" className="form-control" placeholder="Enter Age" value={age} onChange={(e) => setAge(e.target.value)} />
                    </Col>
                    <Col>
                        <input type="checkbox" checked={isActive === 1 ? true : false} onChange={(e) => setIsActive(e.target.checked ? 1 : 0)} />
                        <label>isActive</label>
                    </Col>
                    <Col>
                        <button className="btn btn-primary" onClick={() => handleSave()}>Submit</button>
                        <button className="btn btn-primary" onClick={() => filter()}>Filter</button>
                    </Col>
                </Row>
            </Container>

            <Table striped bordered hover>

                <thead>
                    <tr> 
                        <th>#</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>isActive</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data.length > 0 && data ?
                            data.map((item, index) => {
                                return (
                                    <tr key={index} draggable  onDragStart = {(e) => handleDragStart(e, index)}
                                                onDrop = {(e) => handleDrop(e, index)}
                                                onDragOver = {handleDragOver}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.age}</td>
                                        <td>{item.isActive}</td>
                                        <td colSpan={2}>
                                            <button onClick={() => handleEdit(item.id)} className="btn btn-primary">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="btn btn-danger">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                            :
                            "...Loading"
                    }
                </tbody>
            </Table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <input ref={inputRef} type="text" value={editName} className="form-control" placeholder="Enter Name" onChange={(e) => setEditName(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="text" value={editAge} className="form-control" placeholder="Enter Age" onChange={(e) => setEditAge(e.target.value)} />
                        </Col>
                        <Col>
                            <input type="checkbox" value={editIsActive} checked={editIsActive === 1 ? true : false} onChange={(e) => setEditIsActive(e.target.checked ? 1 : 0)} />
                            <label>isActive</label>
                        </Col>                       
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary"  onClick={() => handleUpdate()}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>)
}

export default CRUD;