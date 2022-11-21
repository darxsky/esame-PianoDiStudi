import {Container, Row, Col, Button, Alert} from 'react-bootstrap'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import API from "../API";
import {useState} from "react";

function ModifyStudyPlanComp(props){

    const setErrorMessage = props.setErrMsg;
    const errorMessage = props.errMsg;

    const [success, setSuccess] = useState('');

    function removeToModifyPlan(id,credit,prerequisite){

        let deletePrerequisite1 = true;
        props.copy.map((row) => {if(row.prerequisite === id) {
            props.setErrMsg('Cancellazione di '+id+' non effettuata! Eliminare prima il corso "'+row.name+'"' )
            deletePrerequisite1 = false;
        }})
        if(deletePrerequisite1 === true){
            props.setCfu(props.cfu - credit)
            props.setCopy((old) => old.filter((row) => row.id !== id));
        }

    }

    async function deleteCoursesInModify() {
        await API.deleteCoursesStudent().then(() => setSuccess('Eliminato'))
            .catch(err => setErrorMessage(err));
    }

    async function aggiungiPlanInModify(arrayPlan, typePlan1, id) {
        await API.addPlan(props.copy)
            .then(() => setSuccess('Inserito'))
            .catch(err => setErrorMessage(err));
    }

    return (

        <>
            <Container style={{borderRadius:"10px", marginTop:"30px"}}>
                <Row>
                    {errorMessage ? <Alert variant='danger' onClose={()=> setErrorMessage('')} dismissible>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                             className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img"
                             aria-label="Warning:">
                            <path
                                d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                        </svg>{errorMessage} </Alert> : ''}
                </Row>
                <Row>
                </Row>
                <Row>
                    <Col></Col>
                    <Col xs={11}>
                        <Row>
                            <Col><h2>Modifica piano di studio</h2></Col>
                            <Col><h5 className="float-end">Crediti selezionati: {props.cfu}/{props.typePlan === 'Part-Time' ? '40' : '80'}</h5></Col>
                        </Row>
                        <table  className='table table-striped'>
                            <thead>
                            <tr className="table-heading" style={{backgroundColor:"#FDD037"}}>
                                <th className="table-header">Codice</th>
                                <th className="table-header">Nome corso</th>
                                <th className="table-header">Crediti</th>
                                <th className="table-header">Azioni</th>
                            </tr>
                            </thead>
                            <tbody>
                            {props.copy.map((row) =>{
                                return (<tr key={row.id} className="table-light" style={{cursor:"pointer"}}>
                                    <th scope='row'>{row.id}</th>
                                    <td>{row.name}</td>
                                    <td>{row.credits}</td>
                                    <td>
                                        <Button type="button" variant={"outline-light"} style={{backgroundColor:"#0295A9"}} onClick={ () =>
                                            removeToModifyPlan(row.id,row.credits,row.prerequisite)
                                        } >
                                            <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                                        </Button>
                                    </td>
                                </tr>)
                            }

                                )}

                            </tbody>
                        </table>
                        <Row>
                            <Col><h6>{props.typePlan === 'Full-Time' ? 'Numero minimo di crediti: 60' : 'Numero minimo di crediti:20'}</h6></Col>
                            <Col><h6>{props.typePlan === 'Full-Time' ? 'Numero massimo di crediti: 80' : 'Numero minimo di crediti:40'}</h6></Col>
                        </Row>
                            <Row>
                                <Col><Button variant={"outline-light"} style={{backgroundColor:"#0295A9"}} className="float-start" onClick={() => {props.setModifyPlan(false);props.setCfu(0)}}>Annulla</Button></Col>
                                <Col><Button variant={"outline-light"} style={{backgroundColor:"#0295A9"}} className="float-end" onClick={async () => {
                                    if (props.typePlan === 'Part-Time') {
                                        if (props.cfu >= 20 && props.cfu <= 40) {
                                            await deleteCoursesInModify();
                                            await aggiungiPlanInModify();
                                            props.setDirty1(false);
                                            props.setCfu(0);
                                            props.setModifyPlan(false);
                                            props.setErrMsg('Success Modify');
                                        } else {
                                            props.setErrMsg('Numero di crediti massimo e minimo non rispettati')
                                        }
                                    } else if (props.typePlan === 'Full-Time') {
                                        if (props.cfu >= 60 && props.cfu <= 80) {
                                            await deleteCoursesInModify();
                                            await aggiungiPlanInModify();
                                            props.setDirty1(false);
                                            props.setCfu(0);
                                            props.setModifyPlan(false);
                                            props.setErrMsg('Success Modify');
                                        } else {
                                            props.setErrMsg('Numero di crediti massimo e minimo non rispettati')
                                        }
                                    }

                                }}>Conferma modifiche</Button></Col>
                            </Row>
                    </Col>
                    <Col></Col>
                </Row>

            </Container>

        </>
    );


}

export {ModifyStudyPlanComp}