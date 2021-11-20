import React, { FC, useState, useEffect, FormEventHandler } from "react";
import {
  Col,
  Row,
  Form,
  InputGroup,
  Button,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import socket from "../config/socket";
import { messageType, showType, userType } from "../types";
import MyMessage from "./MyMessage";
import OtherMessage from "./OtherMessage";

interface Props {
  user: userType;
}

const Chat: FC<Props> = ({ user }) => {
  const [message, setMessage] = useState<messageType>({
    text: "",
    user,
  });
  const [messages, setMessages] = useState<messageType[]>([]);
  const [typing, setTyping] = useState<boolean>(false);
  const [typingUserNames, setTypingUserNames] = useState<string[]>([]);
  const [show, setShow] = useState<showType[]>([]);

  useEffect(() => {
    socket.on("message:messages", (messages: messageType[]) => {
      setMessages(messages);
    });
    socket.on("message:new-message", (message: messageType) =>
      setMessages((messages) => [...messages, message])
    );
    socket.on("message:typing", (userNames: string[]) => {
      setTypingUserNames(userNames.filter((name) => name !== user.name));
    });
    socket.on("message:endTyping", (userNames: string[]) => {
      setTypingUserNames(userNames.filter((name) => name !== user.name));
    });
    socket.on("user:new-user", (name: string) => {
      setShow((show) => [
        ...show,
        {
          show: true,
          text: `${name} se ha conectado`,
        },
      ]);
    });
    socket.on("user:disconnect", (name: string) => {
      setShow((show) => [
        ...show,
        {
          show: true,
          text: `${name} se ha desconectado`,
        },
      ]);
    });
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (message.text) {
      setTyping(true);
    } else {
      setTyping(false);
    }
  }, [message.text]);
  useEffect(() => {
    if (typing) socket.emit("message:typing");
    else socket.emit("message:endTyping");
  }, [typing]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    message.text = message.text.trim();
    if (!message.text) return;
    socket.emit("message:new-message", message);
    setMessages((messages) => [...messages, message]);
    setMessage((message) => ({ ...message, text: "" }));
  };

  const onClose = (i: number) => {
    setShow((show) => {
      show[i].show = false;
      if (show.every((value) => !value.show)) return [];
      return [...show];
    });
  };

  return (
    <>
      <Row className="shadow-lg" style={{ height: "90vh" }}>
        <Col className="d-flex flex-column p-0">
          <div
            className="d-flex flex-column flex-grow-1 rounded-top overflow-auto p-2"
            style={{ height: "0" }}
          >
            {messages.map((message) =>
              message.user.name === user.name ? (
                <MyMessage text={message.text} />
              ) : (
                <OtherMessage name={message.user.name} text={message.text} />
              )
            )}
          </div>
          {typingUserNames.length > 0 && (
            <div className="fw-bold text-muted border-top px-2">
              {typingUserNames.length === 1
                ? `${typingUserNames[0]} está escribiendo`
                : typingUserNames.map((name, i) =>
                    typingUserNames.length - 1 === i
                      ? `y ${name} estan escribiendo`
                      : typingUserNames.length - 2 === i
                      ? `${name} `
                      : `${name}, `
                  )}
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Form.Control
                placeholder="Escribe un mensaje"
                value={message.text}
                onChange={(e) =>
                  setMessage((message) => ({
                    ...message,
                    text: e.target.value,
                  }))
                }
              />
              <Button type="submit">Enviar</Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>
      <ToastContainer position="bottom-end" style={{ zIndex: "999" }}>
        {show.map(({ text, show }, i) => (
          <Toast
            key={i}
            onClose={() => onClose(i)}
            show={show}
            delay={3000}
            autohide
          >
            <Toast.Header closeButton={false}>
              <strong>{text}</strong>
            </Toast.Header>
          </Toast>
        ))}
      </ToastContainer>
    </>
  );
};

export default Chat;
