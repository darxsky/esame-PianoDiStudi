import { Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';

function ValidateEmail(mail) 
{
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
        return (true)
    return (false)
}

function LoginComponents(props){

    const [username, setUsername] = useState('test@polito.it');
    const [password, setPassword] = useState('password');
    const setErrorMessage = props.setErrMsg;
    const errorMessage = props.errMsg;

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        const credentials = {username, password};

        let valid = true;
        if (username === '') {
            setErrorMessage("Campo Email vuoto");
            return
        }

        if (ValidateEmail(username) === false) {
            setErrorMessage("Formato Email errato");
            return
        }

        if (password === '') {
            setErrorMessage("Campo Password vuoto")
            return
        }

        props.login(credentials)

    }

    return (
        <>
        <Container style={{marginTop:"50px", borderRadius:"10px", width:"450px", height:"370px" ,boxShadow:"5px 10px 8px 10px #dedede"}}>
            <Row>
                <Col></Col>
                <Col>
                    <h2 style={{textAlign:"center", marginTop:"15px"}}>Login</h2>
                    <form onSubmit={handleSubmit} className="form-floating" style={{marginTop:"30px"}} >
                    {errorMessage ? <Alert variant='danger' onClose={()=> setErrorMessage('')} dismissible>{errorMessage}</Alert> : ''}
                    <div className="form-floating mb-3">
                        <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" value={username} onChange= {ev => setUsername(ev.target.value) }/>
                        <label htmlFor="floatingInput">Indirizzo Email</label>
                    </div>
                    <div className="form-floating">
                        <input type="password" className="form-control" id="floatingPassword" placeholder="Password" value={password} onChange= {ev => setPassword(ev.target.value) }/>
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                        <br/>
                        <Row>
                            <Col></Col>
                            <Col><button autoFocus={true} type="submit" className='btn btn-outline-light' style={{width:"300px", backgroundColor:"#0295A9"}} >Login</button></Col>
                            <Col></Col>
                            <br/>
                        </Row>
                        
                    </form>
                </Col>
                <Col></Col>
            </Row>
        </Container>
       
      </>
      )
}

function LogoutButton(props) {
    return(
      <Col>
        <span>Welcome</span>{' '}<Button  style={{marginRight:"10px"}} variant="outline-primary" onClick={props.logout}>Logout</Button>
      </Col>
    )
  }

export {LoginComponents, LogoutButton}