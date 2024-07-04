
import { useState } from "react";
// react component that copies the given text inside your clipboard
import { CopyToClipboard } from "react-copy-to-clipboard";
import axios from '../../api/axios';
import { Alert } from "reactstrap";
import '../../assets/css/argon-dashboard.css'
import { toast } from 'react-toastify';
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  UncontrolledTooltip,
  Input,
  Modal,
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Badge
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import { axiosPrivate } from "../../api/axios";

const Icons = () => {
  const SCAN_URL = '/api/scan';
  const [copiedText, setCopiedText] = useState();
  const [image, setImage] = useState(null);
  const [filx, setFilx] = useState(null);
  const [info, setInfo] = useState(null);
  const [predict, setPredict] = useState('');
  const [probability, setProbability] = useState('');
  const [pid, setPid] = useState('');
  const [note, setNote] = useState('');
  const [defaultModal, setDefaultModal] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const toggleModal = () => {
    setDefaultModal(!defaultModal);
  };
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        setImage(base64Image);
        setFilx(file);
        const formData = new FormData();
        formData.append('file', file);
        try {
          const response = await axiosPrivate.post('/predict', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
            // withCredentials: true
          });
          setInfo(response?.data);
          setPredict(response?.data?.prediction ? 'cancerous' : 'noncanceros');
          setProbability(response?.data?.probability);
          console.log('predict', predict)
          console.log('probability', probability)

        } catch (error) {
          console.error('Error uploading the image:', error);
          toast.error('Error uploading the image. Please try again.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setInfo(null);
    setPid('')
    setNote('')
    setPredict('')
    setProbability('')
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('pid', pid);
    formData.append('note', note);
    formData.append('prediction', predict);
    formData.append('probability', probability);
    formData.append('image', filx);

    try {
      const response = await axios.post(SCAN_URL,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
          // withCredentials: true
        }
      );
      toast.info('Saving Successful');
      setPid('')
      setNote('')
      toggleModal()

    } catch (err) {
      if (!(err?.response)) {
        console.log(err)
        setErrMsg('No Server Response');
        toast.error('No Server Response', err);
      } else if (err.response?.status === 400) {
        setErrMsg('Saving error');
        toast.error('Saving error', err);
      } else if (err.response?.status === 401) {
        setErrMsg('Unauthorized');
        toast.error('Unauthorized', err);
      } else {
        setErrMsg('Saving Failed');
        toast.error('Saving Failed', err);
      }

    }

  }


  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--9" fluid>
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Breast Cancer Detection</h3>
              </CardHeader>
              <CardBody>
                <div className="center-content">
                  <Input color="info" type="file" accept="image/*" onChange={handleImageUpload} />
                  {image && (
                    <>
                      <Button color="danger" type="button" onClick={handleImageRemove}> Remove Image</Button>
                      <div>
                        <h2>Uploaded Image:</h2>
                        <img src={image} alt="Uploaded" style={{ width: '500px', height: 'auto' }} />
                      </div>
                      <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: predict === 'cancerous' ? 'red' : 'green' }}>
                          Prediction: {predict}
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'blue', marginTop: '10px' }}>
                          Cancerous Probability: {probability}%
                        </div>
                      </div>
                      <Button
                        block
                        className="mb-3"
                        color="primary"
                        type="button"
                        onClick={toggleModal}
                      >
                        Save Scan
                      </Button>
                      <Modal
                        className="modal-dialog-centered modal-danger"
                        contentClassName="bg-gradient-primary"
                        isOpen={defaultModal}
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
                            <img src={image} alt="Uploaded" style={{ width: '200px', height: 'auto' }} />
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
                          <form onSubmit={handleSubmit}>
                            <FormGroup className="mb-3">
                              <InputGroup className="input-group-alternative">
                                <Input placeholder="Patient ID" type="text"
                                  onChange={(e) => setPid(e.target.value)}
                                  value={pid}
                                />
                              </InputGroup>
                            </FormGroup>
                            <FormGroup>
                              <InputGroup className="input-group-alternative">
                                <Input placeholder="Note" type="textarea"
                                  onChange={(e) => setNote(e.target.value)}
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
                              style={{ float: "right" }}
                              className="btn-white" color="default" type="submit">
                              Save
                            </Button>
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
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Icons;
