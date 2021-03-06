/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState, useEffect } from "react";

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
import Toast from "react-bootstrap/Toast";
import { cloudflare, register } from "../../network/ApiAxios";
import config from "../../config";

const Register = () => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(
    "Email sent! Check it to reset your password."
  );
  const [userID, setUserID] = useState(null);
  useEffect(() => {
    setShowToast(false);
    let geo = JSON.parse(localStorage.getItem("geo"));
    if (geo) {
      setShowToast(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localStorage]);
  const locator = async () => {
    try {
      const locationResponse = await cloudflare();
      const { data } = locationResponse;
      console.log(data);
      localStorage.setItem("geo", JSON.stringify(data));
      setCountry(data.country);
      setCity(data.city);
      if (country && city !== null) {
        setToastMessage(
          `This is prod, so we will send you an email. Please, Check Your Mail`
        );
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage(`Error Accessing Location!${error.message}`);
      setShowToast(true);
    }
  };
  const registerUser = async () => {
    try {
      if (!(name && email && password && confirmPassword && checkbox)) {
        setError(
          "Make sure to fill all the inputs and agree to the privacy policy"
        );
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      // const locationResponse = await cloudflare();
      // console.log(locationResponse);

      const response = await register(name, email, password);

      // const { country, city } = locationResponse;
      // if (country && city) {
      //   setCountry(country);
      //   setCity(city);
      //   setShowToast(true);
      //   localStorage.setItem(JSON.stringify(locationResponse));
      // }
      const { data } = response;
      if (data.error) {
        throw new Error(data.error);
      }
      if (data.url) {
        setUrl(data.url);
      }
      if (!data.success) {
        setError(data.error);
      }
      // if (config.DEMO) {
      //   setToastMessage(
      //     `This is a demo, so we will not send you an email. Instead, click on this link to verify your account:`
      //   );
      // }
      locator();
      setError("");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setCheckbox(false);

      setShowToast(true);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      {country && city !== null ? (
        <div
          aria-live='polite'
          aria-atomic='true'
          style={{
            position: "fixed",
            minHeight: "100px",
            width: "35%",
            right: 10,
            bottom: 80,
            zIndex: 50,
          }}>
          <Toast
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              backgroundColor: "white",
              padding: 10,
              borderRadius: 10,
            }}
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={10000}
            autohide={!config.DEMO}>
            <Toast.Header>
              <img
                style={{ height: "30px", width: "100px" }}
                src={require("../../assets/img/brand/argon-react.png").default}
                alt='...'
              />
            </Toast.Header>
            <Toast.Body>
              {toastMessage}
              <br />
              {country && city !== null ? (
                <>
                  Country: {country} {"  "}
                  City: {city}
                </>
              ) : null}
            </Toast.Body>
          </Toast>
        </div>
      ) : null}
      <Col lg='6' md='8'>
        <Card className='bg-secondary shadow border-0'>
          <CardHeader className='bg-transparent pb-5'>
            <div className='text-muted text-center mt-2 mb-4'>
              <small>Sign up with</small>
            </div>
            <div className='text-center'>
              <Button
                className='btn-neutral btn-icon mr-4'
                color='default'
                href='#pablo'
                onClick={(e) => e.preventDefault()}>
                <span className='btn-inner--icon'>
                  <img
                    alt='...'
                    src={
                      require("../../assets/img/icons/common/github.svg")
                        .default
                    }
                  />
                </span>
                <span className='btn-inner--text'>Github</span>
              </Button>
              <Button
                className='btn-neutral btn-icon'
                color='default'
                href='#pablo'
                onClick={(e) => e.preventDefault()}>
                <span className='btn-inner--icon'>
                  <img
                    alt='...'
                    src={
                      require("../../assets/img/icons/common/google.svg")
                        .default
                    }
                  />
                </span>
                <span className='btn-inner--text'>Google</span>
              </Button>
            </div>
          </CardHeader>
          <CardBody className='px-lg-5 py-lg-5'>
            <div className='text-center text-muted mb-4'>
              <small>Or sign up with credentials</small>
            </div>
            <Form role='form'>
              <FormGroup>
                <InputGroup className='input-group-alternative mb-3'>
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>
                      <i className='ni ni-hat-3' />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder='Name'
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className='input-group-alternative mb-3'>
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>
                      <i className='ni ni-email-83' />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder='Email'
                    type='email'
                    autoComplete='new-email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className='input-group-alternative'>
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>
                      <i className='ni ni-lock-circle-open' />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder='Password'
                    type='password'
                    autoComplete='new-password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className='input-group-alternative'>
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText>
                      <i className='ni ni-lock-circle-open' />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder='Confirm Password'
                    type='password'
                    autoComplete='new-password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              {error ? (
                <div className='text-muted font-italic'>
                  <small>
                    error:{" "}
                    <span className='text-red font-weight-700'>{error}</span>
                  </small>
                </div>
              ) : null}
              <Row className='my-4'>
                <Col xs='12'>
                  <div className='custom-control custom-control-alternative custom-checkbox'>
                    <input
                      className='custom-control-input'
                      id='customCheckRegister'
                      type='checkbox'
                      checked={checkbox}
                      onChange={() => setCheckbox(!checkbox)}
                    />
                    <label
                      className='custom-control-label'
                      htmlFor='customCheckRegister'>
                      <span className='text-muted'>
                        I agree with the{" "}
                        <a href='#pablo' onClick={(e) => e.preventDefault()}>
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                </Col>
              </Row>
              <div className='text-center'>
                <Button
                  onClick={registerUser}
                  className='mt-4'
                  color='primary'
                  type='button'>
                  Create account
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Register;
