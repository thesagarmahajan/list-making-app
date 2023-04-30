import { useEffect, useState } from "react";
import { base_url } from "../config";
import { list } from "../types";
import { Card, Button, Row, Col, Container, Spinner } from "react-bootstrap";
import {Link} from 'react-router-dom'

export default function Lists(){

    let [lists, setLists] = useState<list[]>([]);
    
    function getLists(){
        fetch(`${base_url}/lists?status=true`).then(res=>res.json()).then(resdata=>{
            setLists(resdata)
        })
    }

    async function handleListDelete(listToDelete:list){
        
        listToDelete.status=false
        await fetch(`${base_url}/lists/${listToDelete.id}`, {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(listToDelete)
        })
        .then(res=>console.log(res))

    }
    
    useEffect(()=>{
        getLists()
    },[]);

    return (<>
    <Container as={"section"} style={{padding:"20px"}}>
    <h1>All Lists</h1>
    <br />
    <Row className="d-flex justify-content-center">
        {            
            lists.length==0?<Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>:""
        }
        {
            lists.map((currentList:list)=>{
                return (<>
                    <Col xxl={6}>
                        <Card className="text-center">
                            <Card.Body>
                                <Card.Title>
                                    <h3>{currentList.title}</h3>
                                </Card.Title>
                                    <br />
                                        {/* <div className="d-grid gap-2" style={{ gridTemplateColumns: '1fr 1fr' }}> */}
                                        
                                        <Link to={`/list/${currentList.id}`}>
                                            <Button variant="outline-primary" size="lg">
                                                Edit
                                            </Button>
                                        </Link>

                                        <Button variant="outline-danger" size="lg" onClick={()=>handleListDelete(currentList)}>
                                            Delete
                                        </Button>
                                        {/* </div> */}
                                
                            </Card.Body>
                        </Card>
                    </Col>
                </>)
            })
        } 
    </Row>  
    </Container>
    </>)
}