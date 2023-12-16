import React from 'react';
import { Container, Image, Navbar } from 'react-bootstrap';

export default function HomeNav() {
  return (
    <>
      <Navbar expand="lg" className="main-div">
        <Container className="loginPageNav">
          <Navbar.Brand href="/">
            <Image className="border-0" src="/logo2.png" thumbnail />
          </Navbar.Brand>
        </Container>
      </Navbar>
    </>
  );
}
