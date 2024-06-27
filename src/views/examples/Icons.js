
import { useState } from "react";
// react component that copies the given text inside your clipboard
import { CopyToClipboard } from "react-copy-to-clipboard";
import axios from 'axios';
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
  Badge 
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import { axiosPrivate } from "../../api/axios";

const Icons = () => {
  const [copiedText, setCopiedText] = useState();
  const [image, setImage] = useState(null);
  const [info, setInfo] = useState(null);
  const [predict, setPredict] = useState('');
  const [probability, setProbability] = useState('');

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        setImage(base64Image);
        const formData = new FormData();
        formData.append('file', file);
        try {
          const response = await axiosPrivate.post('/predict', formData,{
            headers: { 'Content-Type': 'multipart/form-data' }
           // withCredentials: true
        });
          setInfo(response?.data);
          setPredict(response?.data?.prediction?'cancerous':'noncanceros');
          setProbability(response?.data?.probability);
          console.log('predict',predict)
          console.log('probability',probability)

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
  };


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
                <Button color="danger" type="button"  onClick={handleImageRemove}> Remove Image</Button>
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
