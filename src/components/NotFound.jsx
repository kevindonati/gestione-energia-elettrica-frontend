import { Button, Col, Container, Row } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

const NotFound = function () {
  const navigate = useNavigate()
  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col xs={12} md={6} className="text-center">
          <div>
            <h3 className="m-0">404 - Pagina non trovata</h3>
            <img
              src="https://placebear.com/300/400"
              alt="not-found-bear"
              className="my-3"
            />
            <h5>
              Ti sei perso?{" "}
              <Button
                variant="info"
                onClick={() => {
                  navigate("/home")
                }}
              >
                Torna in homepage
              </Button>
            </h5>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default NotFound
