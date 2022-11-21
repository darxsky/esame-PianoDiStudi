import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { useNavigate } from 'react-router-dom';
import {Button, Container, NavLink} from "react-bootstrap"

function NavBarComp(props) {

      const handleLogoutClick = () => {
          props.logout();
      }

    const navigate = useNavigate();
    const cliccato = props.ck;
    const setCliccato = props.setCk;

    return (
        <>
        <Navbar expand="lg" style={{backgroundColor:"#0295A9"}}>
            <Container fluid>
                {!cliccato ?
                 <>
                     <Navbar.Brand  href="#home">
                        <svg style={{widht:"24px", height:"24px", color:"white"}} viewBox="0 0 24 24">
                            <path fill="currentColor" d="M16 8C16 10.21 14.21 12 12 12C9.79 12 8 10.21 8 8L8.11 7.06L5 5.5L12 2L19 5.5V10.5H18V6L15.89 7.06L16 8M12 14C16.42 14 20 15.79 20 18V20H4V18C4 15.79 7.58 14 12 14Z" />
                        </svg>
                        <span style={{color:"white"}}>Piano di studi</span>
                    </Navbar.Brand>
                    <Nav className="justify-content-end" >
                        {!props.log ?
                            <Button variant="outline-light" onClick={() => {navigate('/login');setCliccato(true)}}>Login</Button>
                        : <>
                            <NavLink>
                                {props.user !=={} ?
                                    <span style={{paddingRight:"15px",color:"white"}}>Benvenuto <b>{props.user.name}</b></span> : ''}
                            </NavLink>
                            <Button variant="outline-light" style={{float:"right"}} onClick={handleLogoutClick}>Logout</Button></>
                        }
                  </Nav>
                 </>
                : <>
                    <Nav.Link onClick={() => {navigate('/'); setCliccato(false)}}>
                        <svg xmlns="http://www.w3.org/2000/svg" style={{widht:"24px", height:"24px", color:"white"}} fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                        </svg>
                    </Nav.Link>
                </>
                }
            </Container>
        </Navbar>
        </>
    )
}

export {NavBarComp}