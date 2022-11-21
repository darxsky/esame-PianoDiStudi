import {Row, Col, Button} from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";

function AddPlanComp(props){

    //in questo componente viene gestita l'aggiunta di un nuovo piano

    //funzione per rimuovere dal piano (prima della conferma definitiva di aggiunta) un corso
    function removeToPlan(id,credit,prerequisite){

        let deletePrerequisite = true;
        props.arrayPlan.map((row) => {if(row.prerequisite === id) {
                props.setErrMsg('Cancellazione di '+id+' non effettuata! Eliminare prima il corso "'+row.name+'"' )
                deletePrerequisite = false;
        }})
        if(deletePrerequisite === true){
            props.setCfu(props.cfu - credit)
            props.setArrayPlan((old) => old.filter((row) => row.id !== id));
        }

    }

    const navigate = useNavigate();
    return (
        <>
            <Col></Col>
            <Col>
                <Row>
                    <Col><h5>Scegli gli insegnamenti dalla lista dei corsi</h5></Col>
                    <Col><h5 className="float-end">Crediti selezionati: {props.cfu}/{props.typePlan === 'Part-Time' ? '40' : '80'}</h5></Col>
                </Row>
                <table className='table table-striped'>
                    <thead>
                    <tr aria-disabled={true} className="table-heading" style={{backgroundColor:"#FDD037"}}>
                        <th className="table-header">Codice</th>
                        <th className="table-header">Nome corso</th>
                        <th className="table-header">Crediti</th>
                        <th className="table-header">Azioni</th>
                    </tr>
                    </thead>
                    <tbody >
                    {props.arrayPlan.map((row) =>
                        <tr key={row.id} className="table-light" style={{cursor:"pointer"}}>
                            <th scope='row'>{row.id}</th>
                            <td>{row.name}</td>
                            <td>{row.credits}</td>
                            <td style={{marginRight:"0px"}}><Button type="button" variant={"outline-light"} style={{backgroundColor:"#0295A9"}} onClick={() => {removeToPlan(row.id,row.credits,row.prerequisite)}}><FontAwesomeIcon icon={faTrash}></FontAwesomeIcon></Button></td>
                        </tr>
                        )}
                    </tbody>

                </table>
            </Col>
            <Col></Col>
            <Row>
                <Col><h6>{props.typePlan === 'Full-Time' ? 'Numero minimo di crediti: 60' : 'Numero minimo di crediti:20'}</h6></Col>
                <Col><h6>{props.typePlan === 'Full-Time' ? 'Numero massimo di crediti: 80' : 'Numero minimo di crediti:40'}</h6></Col>
            </Row>
            <Row>
                <Col>
                    <Button variant={"outline-light"} style={{backgroundColor:"#0295A9"}} className="float-start" onClick={ ()=> {props.setTypePlan('');props.setConf(false);props.setCfu(0);props.setArrayPlan([])}}>Indietro</Button>
                    <Button variant={"outline-light"} style={{backgroundColor:"#0295A9"}} className="float-end" onClick={() =>
                    {if(props.typePlan === 'Part-Time'){
                        if(props.cfu >= 20 && props.cfu <= 40){
                            props.aggPlan(props.arrayPlan,props.typePlan)
                        }
                        else{
                            props.setErrMsg('Numero di crediti massimo e minimo non rispettati')
                        }
                    }else if(props.typePlan === 'Full-Time'){
                        if(props.cfu >= 60 && props.cfu <= 80){
                            props.aggPlan(props.arrayPlan, props.typePlan)
                        }
                        else{
                            props.setErrMsg('Numero di crediti massimo e minimo non rispettati')
                        }
                    }
                    }
                    }>Conferma Piano</Button>
                </Col>
            </Row>

        </>
    );


}

export {AddPlanComp}