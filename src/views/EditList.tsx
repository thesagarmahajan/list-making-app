import React, { useEffect, useState } from 'react';
import { base_url } from '../config';
import { todo } from '../types';
import {Link, useParams} from 'react-router-dom'
import {Form, Container, Button, Col, Row, Spinner, Modal } from 'react-bootstrap';


interface ListItemProps {
  currentTodo:todo;
  handleCheckUncheck:(currentTodo:todo)=>void;
  makeModalVisibleMethodRef:(currentTodo:todo)=>void;
}

interface EditModalPropsType {
  modalVisibility:boolean;
  makeModalInvisibleMethodRef:()=>void;
  todoToUpdate:todo;
  handleModalTextboxChangeMethodRef:(e:any)=>void,
  handleModalUpdateClickMethodRef:()=>void
}

function EditItemModal(props:EditModalPropsType){
  return (<>
    <Modal show={props.modalVisibility} onHide={props.makeModalInvisibleMethodRef}>
      <Modal.Header closeButton>
        <Modal.Title>Edit List Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Control type="text" value={props.todoToUpdate.title} onChange={props.handleModalTextboxChangeMethodRef}/>    
          </Form.Group>
          <br />
          <Form.Group className="d-flex justify-content-center">
            <Button variant="primary" type="button" onClick={props.handleModalUpdateClickMethodRef}>Update</Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  </>)
}

function ListItem(props:ListItemProps){
  return (<>
    <li className='d-flex'>
        <Form.Check type='checkbox' label={props.currentTodo.status?<del>{props.currentTodo.title}</del>:props.currentTodo.title} checked={props.currentTodo.status} onChange={()=>props.handleCheckUncheck(props.currentTodo)}/>
        &nbsp;
        <Button disabled={props.currentTodo.status} variant="primary" className="ml-5" onClick={()=>props.makeModalVisibleMethodRef(props.currentTodo)}>E</Button>
    </li>
  </>)
}

export default function EditList(){
    const {listId} = useParams();
    let [modalVisibility, setModalVisibility] = useState<boolean>(false);
    // console.log(typeof())
    let [todos, setTodos] = useState<todo[]>([]);
    let [newTodo, setNewTodo] = useState<todo>({
        id:0,
        title:"",
        status:false,
        list_id:Number(listId)
    });
    let [listName, setListName] = useState("");

    let [todoToEdit, setTodoToEdit] = useState<todo>({
      id:0,
      title:"",
      status:false,
      list_id:Number(listId)
    })

    function handleModalTextboxChange(e:any){
      console.log(e.target.value)
      setTodoToEdit({...todoToEdit, title:e.target.value})
    }


  function fetchTodos(){
    
      fetch(`${base_url}/todos?list_id=${listId}`).then((res:any)=>res.json()).then((fetchedTodos:any)=>{
        setTodos(fetchedTodos)
      })
    
  }

  function fetchListName(){
    fetch(`${base_url}/lists/${listId}`).then(res=>res.json()).then(data=>setListName(data.title))
  }

  useEffect(()=>{
    fetchListName()
    fetchTodos()
  },[])

  function handleChange(e:any){
    setNewTodo({
        id:0,
        title:e.target.value,
        status:false,
        list_id:Number(listId)
    })
  }

  function handleSubmit(e:any){
    e.preventDefault();
    console.log(todos)
    setTodos([...todos, newTodo])
    fetch(`${base_url}/todos`, {
      method:"POST",
      headers:{"Content-type":"application/json"},
      body:JSON.stringify(newTodo)
    }).then((res:any)=>{
      if(res.status==201){
        setNewTodo({
            id:0,
            title:"",
            status:false,
            list_id:Number(listId)
        })
        fetchTodos()
      }
      else{

      }
    })
  }

  function handleCheckUncheck(todoToUpdate:todo){
    todoToUpdate.status=!todoToUpdate.status
    console.log(todoToUpdate)
    
    let filteredTodos:todo[] = todos.map((currentTodo:todo)=>{
          if(currentTodo.id==todoToUpdate.id){
            fetch(`${base_url}/todos/${todoToUpdate.id}`, {
              method:"PUT",
              headers:{"Content-type":"application/json"},
              body:JSON.stringify(todoToUpdate)
            }).then((res:any)=>{
              console.log(res)
              currentTodo.status=todoToUpdate.status
            })
            
          }
          return currentTodo
    })
    console.log(filteredTodos)
    setTodos(filteredTodos)
  }

  function makeModalVisible(currentTodo:todo){
    console.log(currentTodo);
    setTodoToEdit(currentTodo)
    setModalVisibility(true);
  }

  function handleModalUpdateClick(){
    console.log(todoToEdit)
    fetch(`${base_url}/todos/${todoToEdit.id}`, 
    {
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(todoToEdit)
    }).then(res=>{
      setModalVisibility(false)
      fetchTodos()
    }).catch(err=>{
      alert("Some Error")
      console.log(err)
    })
  }

  function makeModalInvisible(){
    setModalVisibility(false)
  }

  return (
    <>
        <Container style={{padding:"20px"}}>
            <div className='d-flex'>
                <div className='d-flex ' style={{width:"50%"}}>
                    {
                        listName.length==0?<Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>:<u><h1>{listName}</h1></u>
                    }
                </div>
                <div className='d-flex justify-content-end' style={{width:"50%"}}>
                    <Link to={`/`}>
                        <Button variant="primary">=</Button>
                    </Link>
                </div>
            </div>
            <br />
            <h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" >
                        <Form.Label>Add Item:</Form.Label>
                        <div className=' d-flex mx-auto'>
                            <Form.Control type='text' value={newTodo.title} placeholder='Add Item' onChange={handleChange} />
                            <Button type="submit" variant="primary"><h3>+</h3></Button>
                        </div>   
                </Form.Group>
            </Form>
            {
                listName.length==0?<Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>:""
            }
            <ul>
                {
                todos.map((i:todo)=>{
                    return(<>
                        <ListItem currentTodo={i} handleCheckUncheck={handleCheckUncheck} makeModalVisibleMethodRef={makeModalVisible}/>
                    </>)
                })
                }
            </ul>
            </h3>
            <EditItemModal handleModalUpdateClickMethodRef={handleModalUpdateClick} todoToUpdate={todoToEdit} modalVisibility={modalVisibility} makeModalInvisibleMethodRef={makeModalInvisible} handleModalTextboxChangeMethodRef={handleModalTextboxChange}/>
        </Container>
    </>
  );
}