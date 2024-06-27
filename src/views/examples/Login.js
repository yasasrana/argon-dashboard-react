
import useAuth from '../../hooks/useAuth';
import { Link,useNavigate} from 'react-router-dom';
import React ,{useRef,Section,useState,useEffect}from 'react'
import axios from '../../api/axios';
import { toast } from 'react-toastify';
// reactstrap components
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

const Login = () => {

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const userRef =useRef('');
  const errRef = useRef();

  const [user,setUser] =useState('');
  const [pwd,setPwd] =useState('');
  const [errMsg,setErrMsg] =useState('');
  const LOGIN_URL = '/api/users/login';
  const from = "/admin"

/*   useEffect(()=> {
    userRef.current.focus();
  },[]) */


  const handleSubmit = async (e) => {
    e.preventDefault();
   
    try {
      const response = await axios.post(LOGIN_URL,
          JSON.stringify({ email:user,password:pwd }),
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
          setErrMsg('Missing Username or Password');
          toast.error('Missing Username or Password',err);
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
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
         
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Sign in with your credentials</small>
            </div>
            <form onSubmit={handleSubmit}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
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
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label"
                  htmlFor=" customCheckLogin"
                >
                  <span className="text-muted">Remember me</span>
                </label>
              </div>
              <div className="text-center">
                <Button className="my-4" color="primary" type="submit">
                  Sign in
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="/"
              onClick={(e) => e.preventDefault()}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="/auth/register"
              onClick={(e) => e.preventDefault()}
            >
              <small>Create new account</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
