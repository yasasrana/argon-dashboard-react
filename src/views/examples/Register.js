// reactstrap components
import useAuth from '../../hooks/useAuth';
import { Link,useNavigate} from 'react-router-dom';
import React ,{useRef,Section,useState,useEffect}from 'react'
import axios from '../../api/axios';
import { toast } from 'react-toastify';

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";

const Register = () => {
 const Regis_URL='/api/users'
  const [user,setUser] =useState('');
  const [name,setName] =useState('');
  const [pwd,setPwd] =useState('');
  const [errMsg,setErrMsg] =useState('');
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const from = "/admin"
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    try {
      const response = await axios.post(Regis_URL,
          JSON.stringify({ name:name,email:user,password:pwd }),
          {
              headers: { 'Content-Type': 'application/json' }
             // withCredentials: true
          }
      );

     const accessToken=(response?.data?.accessToken);
     const newUser=(response?.data?.userinfo);

      localStorage.setItem('user',JSON.stringify({user,newUser,accessToken}))
      console.log(JSON.stringify({ user,newUser,accessToken}))
      const userData = { user, newUser, accessToken };
      setAuth(userData);

     toast.info('Login Successful');
     navigate(from);
     

  } catch (err) {
      if (!(err?.response)) {
        console.log(err)
          setErrMsg('No Server Response');
          toast.error('No Server Response',err);
      } else if (err.response?.status === 400) {
          setErrMsg('User Email already exisits');
          toast.error('User Email already exisits',err);
      } else if (err.response?.status === 401) {
          setErrMsg('Unauthorized');
          toast.error('Unauthorized',err);
      } else {
          setErrMsg('Login Failed');
          toast.error('Login Failed',err);
      }
      
  }

  }
  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Sign up with your credentials</small>
            </div>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-hat-3" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input   placeholder="Name"
                   type="text"
                   onChange={(e) => setName(e.target.value)}
                   value={name}
                   required/>
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                   placeholder="Email"
                   type="email"
                   autoComplete="new-email"
                   onChange={(e) => setUser(e.target.value)}
                   value={user}
                   required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                     placeholder="Password"
                     type="password"
                     onChange={(e) => setPwd(e.target.value)}
                     value={pwd}
                     required
                     autoComplete="new-password"
                  />
                </InputGroup>
              </FormGroup>
              
              
              <div className="text-center">
                <Button className="mt-4" color="primary" type="submit">
                  Create account
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Register;
