import {Container ,Row, Col} from 'react-bootstrap'
import {CourseItemComp } from './CourseItemComp';
import {useState} from "react";

function CourseTableComp(props){

    //props proveniente da App.js (utilizzata per lista dei corsi)
    let array = props.array;

    const [added, setAdded] = useState(false);

    const conf = props.conf;
    const setConf = props.setConf;

    const arri = {id: '', name: '', credits: '', prerequisite:'', typePlan:'', numStudent: '', max_num_student:''};

    function addToPlan(row){
        arri.id = row.id
        arri.name = row.name
        arri.credits = row.credits
        arri.prerequisite = row.prerequisite
        arri.typePlan = props.typePlan;
        arri.numStudent = row.num_student;
        arri.max_num_student = row.max_num_students;

        if(props.conf === true){
            props.setCfu(props.cfu + row.credits);
            arri.numStudent = row.num_student + 1;
            props.setArrayPlan(oldArray => {
                const addArray = [...oldArray, arri];
                return addArray;
            });
        }else if(props.modifyPlan === true){
            props.setCfu(props.cfu + row.credits);
            props.setCopy(oldArray => {
                const addArray = [...oldArray, arri];
                return addArray;
            });

        }
    }

    //controllo corsi incompatibili. Se un corso non può essere aggiunto per incompatibilità con un corso
    //già presente nel piano rendo la riga di colore giallo
    function checkIncompatible(row){
        let row1 = JSON.parse(JSON.stringify(row))
        let check = ''
        if(row1.course_incompatible){
            row1.course_incompatible.map((i) => {
                if (check === '') {
                    if(props.conf === true){
                        if (JSON.parse(JSON.stringify(props.arrayPlan)).find((item) => item.id === i) !== undefined) {
                            check = i
                        }
                    }else if(props.modifyPlan === true){
                        if (JSON.parse(JSON.stringify(props.copy)).find((item) => item.id === i) !== undefined) {
                            check = i
                        }
                    }
                }
            })
        }
        return check
    }

    //controllo se il corso è già aggiunto nel piano. Se è già presente rendo la riga di colore verde
    function checkCourse(row){
        let esito = false;
        if(esito !== true){
            if(props.conf === true){
                if(props.arrayPlan.find((item) => item.id === row.id )){
                    esito = true;
                }
            }else if(props.modifyPlan === true){
                if(props.copy.find((item) => item.id === row.id )){
                    esito = true;
                }
            }

        }
        return esito;
    }

    //controllo corsi propedeutici. Se un corso non può essere aggiunto per incompatibilità con un corso
    //già presente nel piano rendo la riga di colore giallo
    function checkPrerequisite(row){
        let find_prerequisite = row.prerequisite;
        if (find_prerequisite !== null){
            if(props.conf === true){
                if(props.arrayPlan.find((item) =>
                    item.id === row.prerequisite
                ) !== undefined){
                    find_prerequisite = '';
                }
            }else if(props.modifyPlan === true){
                if(props.copy.find((item) =>
                    item.id === row.prerequisite
                ) !== undefined){
                    find_prerequisite = '';
                }
            }

        }
        if (!find_prerequisite) find_prerequisite = ''
        return find_prerequisite
    }

    //controllo sul numero di studenti di un corso
    function checkNumOfStudentMax(row){
        let findMax = '';
        if(row.num_student === row.max_num_students && row.num_student !== null){
            findMax = 'trovato'
        }
        return findMax;
    }


    return (
        <>
            <Container style={{ borderRadius:"10px", marginTop:"20px"}}>
                <Row></Row>
                <Row>
                    <Col></Col>
                    <Col xs={11}>
                        <h2>Lista dei corsi</h2>
                        {props.conf === true || props.modifyPlan === true ? <h6>Legenda colori: verde(già inserito), giallo(incompatibile), azzurro(numero max studenti raggiunto), rosso(propedeutico)</h6> :''}
                        <table className='table table-striped table-hover'>
                            <thead>
                            <tr className="table-heading" style={{backgroundColor:"#FDD037"}}>
                                <th className="table-header">Codice</th>
                                <th className="table-header">Nome corso</th>
                                <th className="table-header">Crediti</th>
                                <th className="table-header">Numero massimo studenti</th>
                                <th className="table-header">Scelto da studenti</th>
                                <th className="table-header"></th>
                                {props.conf === true || props.modifyPlan === true ? <th className="table-header">Azioni</th> : '' }
                            </tr>
                            </thead>
                            <tbody >
                            {array.map((row) => {
                                    //viene gestito tutto in maniera dinamica in base al contenuto del piano di studio che man mano viene compilato
                                    //richiamo le funzioni precedenti per ogni riga
                                    //passo i risultati al componente CourseItemComp che gestisce le righe (colora le righe in base al risultato)
                                    let checkInc = checkIncompatible(row);
                                    let checkCour = checkCourse(row);
                                    let find = checkPrerequisite(row);
                                    let numMax = checkNumOfStudentMax(row)
                                    if (checkInc !== '')
                                        return (
                                            <CourseItemComp checkCourse={checkCour} find={find} added={added}
                                                            error={{incompatible: checkInc}} setAdded={setAdded}
                                                            addToPlan={addToPlan} conf={conf}
                                                            setConf={setConf} arrayPlan={props.arrayPlan}
                                                            setArrayPlan={props.setArrayPlan} cfu={props.cfu}
                                                            numStudent={props.numStudent} setNumStudent={props.setNumStudent}
                                                            setCfu={props.setCfu} key={row.id} row={row}
                                                            modifyPlan={props.modifyPlan}
                                                            setModifyPlan={props.setModifyPlan}/>
                                        )
                                    else if (find !== '') {
                                        return (
                                            <CourseItemComp checkCourse={checkCour} error={{prerequisite: find}}
                                                            added={added} setAdded={setAdded} addToPlan={addToPlan} conf={conf}
                                                            setConf={setConf} arrayPlan={props.arrayPlan}
                                                            setArrayPlan={props.setArrayPlan} cfu={props.cfu}
                                                            numStudent={props.numStudent} setNumStudent={props.setNumStudent}
                                                            setCfu={props.setCfu} key={row.id} row={row}
                                                            modifyPlan={props.modifyPlan}
                                                            setModifyPlan={props.setModifyPlan}/>
                                        )
                                    }else if (numMax !== '') {
                                        return (
                                            <CourseItemComp checkCourse={checkCour} error={{numeral: numMax}}
                                                            added={added} setAdded={setAdded} addToPlan={addToPlan} conf={conf}
                                                            setConf={setConf} arrayPlan={props.arrayPlan}
                                                            setArrayPlan={props.setArrayPlan} cfu={props.cfu}
                                                            numStudent={props.numStudent} setNumStudent={props.setNumStudent}
                                                            setCfu={props.setCfu} key={row.id} row={row}
                                                            modifyPlan={props.modifyPlan}
                                                            setModifyPlan={props.setModifyPlan}/>
                                        )
                                    }  else
                                        return (
                                            <CourseItemComp checkCourse={checkCour}
                                                            added={added}
                                                            setAdded={setAdded}
                                                            addToPlan={addToPlan}
                                                            conf={conf}
                                                            setConf={setConf}
                                                            arrayPlan={props.arrayPlan}
                                                            setArrayPlan={props.setArrayPlan}
                                                            key={row.id}
                                                            row={row}
                                                            numStudent={props.numStudent} setNumStudent={props.setNumStudent}
                                                            modifyPlan={props.modifyPlan}
                                                            setModifyPlan={props.setModifyPlan}/>)
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

export {CourseTableComp}
