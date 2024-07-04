import axios from '../../api/axios';
import React, { useEffect, useState } from 'react';

// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
  InputGroup, FormGroup, Input, Button, Modal
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";


const Tables = () => {

  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [predict, setPredict] = useState('');
  const [probability, setProbability] = useState('');
  const [pid, setPid] = useState('');
  const [note, setNote] = useState('');
  useEffect(() => {
    const fetchScans = async () => {
      try {
        const response = await axios.get('/api/scan'); // Adjust the URL as necessary
        setScans(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchScans();
  }, []);


  const handleRowClick = (scan) => {
    setSelectedImage(`http://localhost:8000/${scan.image}`);
    setShowModal(true);
    setNote(scan?.note)
    setPid(scan?.pid)
    setProbability(scan?.probability)
    setPredict(scan?.prediction)

  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">History</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">SCAN ID</th>
                    <th scope="col">PID</th>
                    <th scope="col">PREDICTION</th>
                    <th scope="col">PROBABLILITY</th>
                    <th scope="col">NOTE</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>

                  {scans.map((scan) => (
                    <tr key={scan._id} onClick={() => handleRowClick(scan)}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <a
                            className="avatar rounded-circle mr-3"
                            href="#pablo"
                            onClick={(e) => e.preventDefault()}
                          >
                            <img
                              alt="..."
                              src={`http://localhost:8000/${scan.image}`}
                            />
                          </a>
                          <Media>
                            <span className="mb-0 text-sm">
                              {scan._id}
                            </span>
                          </Media>
                        </Media>
                      </th>
                      <td>{scan.pid}</td>
                      <td>{scan.prediction}</td>
                      <td>{scan.probability}</td>
                      <td>{scan.note}</td>

                    </tr>
                  ))}

                </tbody>
              </Table>

              <Modal
                className="modal-dialog-centered modal-danger"
                contentClassName="bg-gradient-primary"
                isOpen={showModal}
                toggle={toggleModal}
              >

                <div className="modal-header">

                  <button
                    aria-label="Close"
                    className="close"
                    data-dismiss="modal"
                    type="button"
                    onClick={toggleModal}
                  >
                    <span aria-hidden={true}>×</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="center-content p-3">
                    <h2>Scaned Image:</h2>
                    {selectedImage && (
                      <img src={selectedImage} alt="Selected Scan" style={{ width: '200px', height: 'auto' }} />
                    )}
                    <Row className="p-2">
                      <Button
                        color={predict === 'cancerous' ? 'danger' : 'success'}
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                      >
                        {predict}
                      </Button>
                      <Button
                        color="warning"
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                      >
                        {probability}%
                      </Button>
                    </Row>
                  </div>
                  <form >
                    <FormGroup className="mb-3">
                      <InputGroup className="input-group-alternative">
                        <Input placeholder="Patient ID" type="text"
                          disabled
                          value={pid}
                        />
                      </InputGroup>
                    </FormGroup>
                    <FormGroup>
                      <InputGroup className="input-group-alternative">
                        <Input placeholder="Note" type="textarea"
                          disabled
                          value={note}
                        />
                      </InputGroup>
                    </FormGroup>
                    <div className="custom-control custom-control-alternative custom-checkbox">
                      <input
                        className="custom-control-input"
                        id=" customCheckLogin"
                        type="checkbox"
                      />
                    </div>

                    <Button
                      className="text-white ml-auto"
                      color="link"
                      style={{ float: "right" }}
                      data-dismiss="modal"
                      type="button"
                      onClick={toggleModal}
                    >
                      Close
                    </Button>
                  </form>
                </div>

              </Modal>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className="disabled">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Previous</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem className="active">
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        2 <span className="sr-only">(current)</span>
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Next</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>

      </Container>
    </>
  );
};

export default Tables;
