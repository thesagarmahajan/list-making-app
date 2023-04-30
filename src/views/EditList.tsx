import React, { useEffect, useState } from 'react';
import { base_url } from '../config';
import { item } from '../types';
import {Link, useParams} from 'react-router-dom'
import {Form, Container, Button, Col, Row, Spinner, Modal } from 'react-bootstrap';


interface ListItemProps {
  currentItem:item;
  handleCheckUncheck:(currentItem:item)=>void;
  makeModalVisibleMethodRef:(currentItem:item)=>void;
}

interface EditModalPropsType {
  modalVisibility:boolean;
  makeModalInvisibleMethodRef:()=>void;
  itemToUpdate:item;
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
            <Form.Control type="text" value={props.itemToUpdate.title} onChange={props.handleModalTextboxChangeMethodRef}/>    
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
        <Form.Check type='checkbox' label={props.currentItem.status?<del>{props.currentItem.title}</del>:props.currentItem.title} checked={props.currentItem.status} onChange={()=>props.handleCheckUncheck(props.currentItem)}/>
        &nbsp;
        <Button disabled={props.currentItem.status} variant="primary" className="ml-5" onClick={()=>props.makeModalVisibleMethodRef(props.currentItem)}>E</Button>
    </li>
  </>)
}

export default function EditList(){
    const {listId} = useParams();
    let [modalVisibility, setModalVisibility] = useState<boolean>(false);
    // console.log(typeof())
    let [items, setItems] = useState<item[]>([]);
    let [newItem, setNewItem] = useState<item>({
        id:0,
        title:"",
        status:false,
        list_id:Number(listId)
    });
    let [listName, setListName] = useState("");

    let [itemToEdit, setItemToEdit] = useState<item>({
      id:0,
      title:"",
      status:false,
      list_id:Number(listId)
    })

    function handleModalTextboxChange(e:any){
      console.log(e.target.value)
      setItemToEdit({...itemToEdit, title:e.target.value})
    }


  function fetchItems(){
    
      fetch(`${base_url}/items?list_id=${listId}`).then((res:any)=>res.json()).then((fetchedItems:any)=>{
        setItems(fetchedItems)
      })
    
  }

  function fetchListName(){
    fetch(`${base_url}/lists/${listId}`).then(res=>res.json()).then(data=>setListName(data.title))
  }

  useEffect(()=>{
    fetchListName()
    fetchItems()
  },[])

  function handleChange(e:any){
    setNewItem({
        id:0,
        title:e.target.value,
        status:false,
        list_id:Number(listId)
    })
  }

  function handleSubmit(e:any){
    e.preventDefault();
    console.log(items)
    setItems([...items, newItem])
    fetch(`${base_url}/items`, {
      method:"POST",
      headers:{"Content-type":"application/json"},
      body:JSON.stringify(newItem)
    }).then((res:any)=>{
      if(res.status==201){
        setNewItem({
            id:0,
            title:"",
            status:false,
            list_id:Number(listId)
        })
        fetchItems()
      }
      else{

      }
    })
  }

  function handleCheckUncheck(itemToUpdate:item){
    itemToUpdate.status=!itemToUpdate.status
    console.log(itemToUpdate)
    
    let filteredItems:item[] = items.map((currentItem:item)=>{
          if(currentItem.id==itemToUpdate.id){
            fetch(`${base_url}/items/${itemToUpdate.id}`, {
              method:"PUT",
              headers:{"Content-type":"application/json"},
              body:JSON.stringify(itemToUpdate)
            }).then((res:any)=>{
              console.log(res)
              currentItem.status=itemToUpdate.status
            })
            
          }
          return currentItem
    })
    console.log(filteredItems)
    setItems(filteredItems)
  }

  function makeModalVisible(currentItem:item){
    console.log(currentItem);
    setItemToEdit(currentItem)
    setModalVisibility(true);
  }

  function handleModalUpdateClick(){
    console.log(itemToEdit)
    fetch(`${base_url}/items/${itemToEdit.id}`, 
    {
      method:"PUT",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(itemToEdit)
    }).then(res=>{
      setModalVisibility(false)
      fetchItems()
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
                            <Form.Control type='text' value={newItem.title} placeholder='Add Item' onChange={handleChange} />
                            <Button type="submit" variant="primary"><h3>+</h3></Button>
                        </div>   
                </Form.Group>
            </Form>
            {
                listName.length==0?<Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>:""
            }
            <ul>
                {
                items.map((i:item)=>{
                    return(<>
                        <ListItem currentItem={i} handleCheckUncheck={handleCheckUncheck} makeModalVisibleMethodRef={makeModalVisible}/>
                    </>)
                })
                }
            </ul>
            </h3>
            <EditItemModal handleModalUpdateClickMethodRef={handleModalUpdateClick} itemToUpdate={itemToEdit} modalVisibility={modalVisibility} makeModalInvisibleMethodRef={makeModalInvisible} handleModalTextboxChangeMethodRef={handleModalTextboxChange}/>
        </Container>
    </>
  );
}