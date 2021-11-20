import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import { userType } from "./types";
import Chat from "./components/Chat";
import Login from "./components/Login";
import socket from "./config/socket";

function App() {
  const [user, setUser] = useState<userType>();

  useEffect(() => {
    socket.on('user:login', (user: userType) => {
      setUser(user)
    })
  }, [])

  return (
    <Container className="my-3">
      {user ? <Chat user={user} /> : <Login />}
    </Container>
  );
}

export default App;
