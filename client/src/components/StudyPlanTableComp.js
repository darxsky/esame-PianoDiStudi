import {Container, Row, Col, Button, Alert} from 'react-bootstrap'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons";
import API from "../API";

function StudyPlanTableComp(props){

    //componente che mostra il piano di studi di uno studente
    //Se non è presente nessun piano allo studente viene data la possibilità di aggiungerlo tramite il bottone "Aggiungi Piano"
    //Altrimenti può modificarlo o eliminarlo

    function deleteCourses() {
        API.deleteCoursesStudent().then(props.setPlan([]))
            .catch( err => console.log(err));
        API.deletePlanStudent().then().catch(err => console.log(err));
        props.setDirty(true);
    }

    let array = props.array;
    let plan1 = props.plan;

    return (

        <>
        <Container style={{borderRadius:"10px", marginTop:"30px"}}>
            <Row>
                {props.errMsg === 'Success Add' ? <Alert variant='success' onClose={()=> props.setErrMsg('')} dismissible>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                         className="bi bi-check-circle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img"
                         aria-label="Success:">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                    </svg>
                    Piano inserito con successo! </Alert> : props.errMsg === 'Success Modify' ?
                    <Alert variant='success' onClose={()=> props.setErrMsg('')} dismissible>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                             className="bi bi-check-circle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img"
                             aria-label="Success:">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                        </svg>
                        Piano aggiornato con successo! </Alert>: ''}
            </Row>
            <Row>
                <Col></Col>
                <Col xs={11}>
                    <Row>
                        <Col> <h2>Piano di studio</h2></Col>{props.plan.length === 0 ?
                        <>
                            <Col>
                                <Button variant="outline-light" className="float-end" style={{backgroundColor:"#12ADC1"}} onClick={() => {props.setAddPlan(true);props.setTypePlan('');props.setErrMsg('')}}>
                                    <FontAwesomeIcon icon={faPlus} /> Aggiungi piano
                                </Button>
                            </Col></>
                            :
                            <Col>
                                    <><Button variant="outline-light" className="float-end" style={{backgroundColor:"#12ADC1"}} onClick={() => deleteCourses()}>
                                        <FontAwesomeIcon icon={faTrash} /> Elimina piano
                                    </Button>
                                    <Button variant="outline-light" className="float-end" style={{backgroundColor:"#12ADC1"}} onClick={() => {props.setModifyPlan(true);props.setErrMsg('')}} >
                                        <FontAwesomeIcon icon={faPenToSquare} /> Modifica piano
                                    </Button></>
                            </Col>  }
                    </Row>
                    <table  className='table table-striped'>
                        <thead>
                            <tr className="table-heading" style={{backgroundColor:"#FDD037"}}>
                                <th className="table-header">Codice</th>
                                <th className="table-header">Nome corso</th>
                                <th className="table-header">Crediti</th>
                            </tr>
                        </thead>
                        <tbody>
                        {plan1.length === 0 ? <tr className="table-light" style={{cursor:"pointer"}}><td colSpan={3}><h4>Nessun corso presente! Compila il piano</h4></td></tr>
                            : plan1.map((row) =>{
                                return (<tr key={row.id} className="table-light" style={{cursor:"pointer"}}>
                                    <th scope='row'>{row.id}</th>
                                    <td>{row.name}</td>
                                    <td>{row.credits}</td>
                                </tr>)
                        })}
                        </tbody>
                    </table>
                </Col>
                <Col></Col>
            </Row>
        </Container>

        </>
    );


}

export {StudyPlanTableComp}