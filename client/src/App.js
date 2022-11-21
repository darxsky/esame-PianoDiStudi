import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { CourseTableComp } from "./components/CourseTableComp"
import { LoginComponents } from './components/LoginComp';
import { NavBarComp } from './layout/NavBarComp';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import API from './API';
import { StudyPlanTableComp } from './components/StudyPlanTableComp';
import { StudyPlanItemComp } from './components/StudyPlanItemComp';
import { ModifyStudyPlanComp } from './components/ModifyStudyPlanComp';

function App() {
    return (
        <Router>
            <App2 />
        </Router>
    )
}

function App2() {

    const navigate = useNavigate();

    //stato contenente l'array per il piano di studi. Si popola nell'aggiunta di un nuovo piano
    const [arrayPlan, setArrayPlan] = useState([]);
    //stato per il login.Setto lo stato a true all'accesso dello studente
    const [loggedIn, setLoggedIn] = useState(false);
    //stato contenente la lista dei corsi che recupero dal db
    const [array, setTestArr] = useState([])
    //stato contenente la lista dei corsi che lo studente ha scelto. Recuperata dal db
    const [plan,setPlan] = useState([]);
    //stato per l'utente che effettua l'accesso
    const [user, setUser] = useState({});
    //stato per i messaggi di errore/successo nelle operazioni
    const [message, setMessage] = useState('');
    const [dirty, setDirty] = useState(true);
    const [dirty1, setDirty1] = useState(true);
    //stato inserito per gestire la navbar
    const [clickLogin, setClickLogin] = useState();
    //stato per tenere traccia se lo studente modifica il piano
    const [modifyPlan, setModifyPlan] = useState(false);
    //stato per tenere traccia se lo studente aggiunge un piano
    const [addPlan, setAddPlan] = useState(false);
    // stato per tipo piano
    const [typePlan, setTypePlan] = useState('');
    //stato per bottone conferma dopo scelta tipo piano
    const [conf, setConf] = useState(false);
    const [cfu, setCfu] = useState(0);
    //stato contenente la copia del piano. In caso di annullamento modifica si torna alla copia persistente
    const [copy,setCopy] = useState([]);
    const [numStudent, setNumStudent] = useState([]);

    useEffect(()=> {
        const checkAuth = async() => {
            try {
                const user = await API.getStudentInfo();
                setLoggedIn(true);
                setUser(user);
            } catch(err) {
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        const prova = async() => {
            await API.getAllCourses()
                .then( (courses) => {setTestArr(courses);setDirty(true)} )
                .catch( err => console.log(err))
        }
        prova()
    },[plan.length,dirty1,modifyPlan])

    useEffect(() => {
        const nStudent = async() => {
            await API.getNumberOfStudent()
                .then( (number) => {setNumStudent(number)} )
                .catch( err => console.log(err))
        }
        nStudent();
    },[plan.length,dirty1,modifyPlan])

    useEffect(() => {
        if (loggedIn){
            const getPlan = async() => {
                await API.getPlanStudent()
                    .then( (plan) => {setPlan(plan);setCopy(Array.from(plan));
                        if(plan.length !== 0)
                            setCfu(plan[0].credit)} )
                    .catch( err => console.log(err));
                if(plan.length!==0){
                    await API.getTypePlanStudent()
                        .then( (type) => {setTypePlan(type.type);} )
                        .catch( err => console.log(err));
                }
            }
            getPlan();
        }
    }, [loggedIn,modifyPlan,dirty])


    function aggiungiPlan(arrayPlan,typePlan1,id) {
        typePlan1 = typePlan;
        API.addPlan(arrayPlan)
            .then( () => {
                setAddPlan(false);
                setArrayPlan([]);
                setConf(false);
                setDirty(false);
                setCfu(0);
                setMessage('Success Add');
            } )
            .catch( err => setMessage(err));
        API.addTypePlan(typePlan1,id)
            .then( () => navigate('/') )
            .catch( err => setMessage(err));
    }

    const doLogIn = (credentials) => {
        API.logIn(credentials)
            .then( user => {
                setLoggedIn(true);
                setUser(user);
                setMessage('');
                setClickLogin(false);
                navigate('/')
            })
            .catch(err => {
                setMessage(err);
                console.log(err)
            })
    }

    const doLogOut = () => {
        API.logOut().then()
        setLoggedIn(false);
        setMessage('');
        setUser({});
        setAddPlan(false);
        setTypePlan('');
        setConf(false);
        setCfu(0);
        setArrayPlan([]);
        setModifyPlan(false);
        setPlan([]);
        setCopy([]);
        setDirty(true);
        setDirty(true);
    }

    return (
        <Routes>
            <Route path='/' element={ <><Layout user={user} array={array} log={loggedIn} setLog={setLoggedIn} logout={doLogOut} ckLogin={clickLogin} setCkLogin={setClickLogin} plan={plan} setPlan={setPlan}></Layout></> }>
                <Route path='/' element={ loggedIn ? (addPlan ?
                        <><StudyPlanItemComp
                            aggiungiPlan={aggiungiPlan}
                            errMsg={message} setErrMsg={setMessage}
                            arrayPlan={arrayPlan} setArrayPlan={setArrayPlan}
                            cfu={cfu} setCfu={setCfu}
                            typePlan={typePlan} setTypePlan={setTypePlan}
                            conf={conf} setConf={setConf} addPlan={addPlan}
                            setAddPlan={setAddPlan} dirty={dirty} setDirty={setDirty}></StudyPlanItemComp>
                            <CourseTableComp
                                arrayPlan={arrayPlan} setArrayPlan={setArrayPlan}
                                modifyPlan={modifyPlan} setModifyPlan={setModifyPlan}
                                cfu={cfu} setCfu={setCfu}
                                plan={plan} setPlan={setPlan}
                                array={array} addPlan={addPlan}
                                setAddPlan={setAddPlan}
                                copy={copy} setCopy={setCopy}
                                typePlan={typePlan} setTypePlan={setTypePlan}
                                numStudent={numStudent} setNumStudent={setNumStudent}
                                conf={conf} setConf={setConf}></CourseTableComp></>
                        : <>{modifyPlan !== true ?
                            <StudyPlanTableComp
                                aggiungiPlan={aggiungiPlan}
                                modifyPlan={modifyPlan} setModifyPlan={setModifyPlan}
                                errMsg={message} setErrMsg={setMessage}
                                arrayPlan={arrayPlan} setArrayPlan={setArrayPlan}
                                cfu={cfu} setCfu={setCfu}
                                dirty={dirty} setDirty={setDirty}
                                typePlan={typePlan} setTypePlan={setTypePlan}
                                plan={plan} setPlan={setPlan}
                                addPlan={addPlan} setAddPlan={setAddPlan}>
                            </StudyPlanTableComp>: <ModifyStudyPlanComp dirty1={dirty1} setDirty1={setDirty1} typePlan={typePlan} setTypePlan={setTypePlan} errMsg={message} setErrMsg={setMessage} cfu={cfu} setCfu={setCfu} copy={copy} setCopy={setCopy} plan={plan} setPlan={setPlan} modifyPlan={modifyPlan} setModifyPlan={setModifyPlan}></ModifyStudyPlanComp>
                        }<CourseTableComp numStudent={numStudent} setNumStudent={setNumStudent} typePlan={typePlan} setTypePlan={setTypePlan} copy={copy} setCopy={setCopy} plan={plan} setPlan={setPlan} modifyPlan={modifyPlan} setModifyPlan={setModifyPlan} arrayPlan={arrayPlan} setArrayPlan={setArrayPlan} cfu={cfu} setCfu={setCfu} array={array} addPlan={addPlan} setAddPlan={setAddPlan} conf={conf} setConf={setConf}></CourseTableComp></>)
                    : <CourseTableComp numStudent={numStudent} setNumStudent={setNumStudent} typePlan={typePlan} setTypePlan={setTypePlan} copy={copy} plan={plan} setPlan={setPlan} modifyPlan={modifyPlan} setModifyPlan={setModifyPlan} arrayPlan={arrayPlan} setArrayPlan={setArrayPlan} cfu={cfu} setCfu={setCfu} array={array} addPlan={addPlan} seetAddPlan={setAddPlan} conf={conf} setConf={setConf} ></CourseTableComp>} />
                <Route path='/login' element={<LoginComponents login={doLogIn} errMsg={message} setErrMsg={setMessage}/>} />
            </Route>
            <Route path='*' element={<h1>Error 404, Page Not Found</h1>} />
        </Routes>
    );
}

function Layout(props){
    return (
        <div >
            <header>
                <NavBarComp user={props.user} log={props.log} setLog={props.setLog} ck={props.ckLogin} setCk={props.setCkLogin} logout={props.logout}></NavBarComp>
            </header>
            <div>
                <div>
                    <main>
                        {
                            <Outlet/>
                        }
                    </main>
                </div>
            </div>

        </div>
    );
}

export default App;