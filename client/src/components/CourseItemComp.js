import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faPlus, faAngleUp} from "@fortawesome/free-solid-svg-icons";

function CourseItemComp(props){

    //in questo componente gestisco i risultati che arrivano dalle funzioni di controllo presenti in CourseTableComp
    //corsi incompatibli : colore giallo
    //corsi propedeutici: colore rosso
    //corso già presente nel piano: colore verde
    //corso che ha raggiunto il numero massimo di iscritti: colore azzurro

    //Inoltre, a seconda del risultato, rendo il bottone di aggiunta della riga non selezionabile.
    //Mediante un TOOLTIP sul button indico la ragione


    const [open, setOpen] = useState();
    const [detailsOpen, setDetailsOpen] = useState([]);

    let row = props.row;
    let arrayPlan = props.arrayPlan;

    function toggleShown(codice){

        const shownState = detailsOpen.slice();
        const index = shownState.indexOf(codice);

        if(index >= 0){
            shownState.splice(index,1);
            setDetailsOpen(shownState);
        }else{
            shownState.push(codice);
            setDetailsOpen(shownState);
        }
    
    }

    return (
        <>
        <tr className=
                {props.conf === true || props.modifyPlan === true ?
                    props.checkCourse ? "table-success"
                    : props.error && props.error.incompatible !== undefined ? "table-warning"
                    : props.error && props.error.prerequisite !== undefined ? "table-danger"
                    : props.error && props.error.numeral !== undefined ? "table-primary"
                    : 'table-light'
                : ''}
            style={{cursor:"pointer"}}>
            <th scope='row'>{row.id}</th>
            <td>{row.name}</td>
            <td>{row.credits}</td>
            <td>{row.max_num_students}</td>
            <td>{props.numStudent.map((numb) => {
                if(row.id === numb.id){
                    row.num_student = numb.num_student;
                    return row.num_student;
                }
            })}
            </td>
            <td>{open ? <FontAwesomeIcon icon={faAngleUp} onClick={() => {toggleShown(row.id); setOpen(false)}}></FontAwesomeIcon> :
                <FontAwesomeIcon icon={faAngleDown} onClick={() => {toggleShown(row.id); setOpen(true)}}></FontAwesomeIcon>}</td>
            {props.conf === true  || props.modifyPlan === true ? <>
                <td>
                    { (props.error && props.error.incompatible !== undefined ) ?
                        <>
                            <OverlayTrigger overlay={
                                <Tooltip id="tooltip-disabled">
                                    Incompatibile con {row.course_incompatible[0]}  {row.course_incompatible[1] !== undefined ? 'e ' +row.course_incompatible[1] : ''}
                                </Tooltip>}>
                                <span className="d-inline-block">
                                    <Button type="button" className="btn" style={{backgroundColor:"#0295A9"}} variant={"outline-light"} disabled>
                                        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                                    </Button>
                                </span>
                        </OverlayTrigger></>
                        : props.error && props.error.prerequisite !== undefined ?
                            <>
                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Propedeutico con {row.prerequisite}</Tooltip>}>
                                    <span className="d-inline-block">
                                        <Button type="button" className="btn" style={{backgroundColor:"#0295A9"}} variant={"outline-light"} disabled>
                                            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                                        </Button>
                                    </span>
                                </OverlayTrigger>
                            </>
                        : props.error && props.error.numeral !== undefined ?
                            <>
                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Raggiunto il numero massimo di studenti</Tooltip>}>
                                <span className="d-inline-block">
                                    <Button type="button" className="btn" style={{backgroundColor:"#0295A9"}} variant={"outline-light"} disabled>
                                        <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                                    </Button>
                                </span>
                                </OverlayTrigger>
                            </>
                        : props.checkCourse ? <>
                                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Già inserito</Tooltip>}>
                                    <span className="d-inline-block">
                                        <Button type="button" className="btn" style={{backgroundColor:"#0295A9"}} variant={"outline-light"} disabled>
                                            <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                                        </Button>
                                    </span>
                                    </OverlayTrigger>
                                </>
                    : <Button type="button" variant={"outline-light"} style={{backgroundColor:"#0295A9"}} onClick={() => props.addToPlan(row)}><FontAwesomeIcon icon={faPlus}></FontAwesomeIcon></Button> }
                </td></>
            : ''}
        </tr>
        <tr>
            <td colSpan={6}>
                <table className="table mb-0" >
                {detailsOpen.includes(row.id) &&
                <><thead>
                <tr className="table-heading">
                    <th colSpan={7} className="table-header">Propedeuticità</th>
                    <th colSpan={7} className="table-header">Incompatibilità</th>
                </tr>
            </thead>
                <tbody><tr className='additional-info'>
                    <td colSpan={7}>{row.prerequisite === null ? <div>Nessuna Propedeuticità</div> : <div>{row.prerequisite}</div>}</td>
                    <td colSpan={7}>{row.course_incompatible === null ?
                        <div>Nessuna Incompatibilità</div>
                        : <div>{Array.isArray(row.course_incompatible) ?
                            <><ul><li>{row.course_incompatible[0]}</li>{row.course_incompatible.length > 1 ? <li>{row.course_incompatible[1]}</li> :''}</ul></>
                            : <>{row.course_incompatible}</> }</div>}
                    </td>
                </tr>
                </tbody>
                    </>
            }
                </table>
            </td>
        </tr>
            

        </>
    )
}

export {CourseItemComp}
