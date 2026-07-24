import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { Link } from "react-router-dom"

const Header = function () {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={Link} to="/home">
          Gestione Energia
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="w-100 d-flex justify-content-between align-items-center">
            <div className="d-flex">
              <Nav.Link as={Link} to="/home">
                Home
              </Nav.Link>

              <NavDropdown title="Clienti" id="basic-nav-dropdown2">
                <NavDropdown.Item as={Link} to="/lista-clienti">
                  Gestione clienti
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/crea-cliente">
                  Crea cliente
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown title="Fatture" id="basic-nav-dropdown3">
                <NavDropdown.Item as={Link} to="/lista-fatture">
                  Gestione fatture
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/crea-fattura">
                  Crea fattura
                </NavDropdown.Item>
              </NavDropdown>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
