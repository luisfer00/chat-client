import React, { FC } from "react";
import { Alert } from "react-bootstrap";

interface Props {
  text: string;
}

const MyMessage: FC<Props> = ({ text }) => {
  return (
    <Alert
      className="d-flex flex-column flex-shrink-1 align-self-end"
      style={{ maxWidth: "90%", width: "max-content" }}
      variant="success"
    >
      <div style={{ wordWrap: "break-word" }}>{text}</div>
    </Alert>
  );
};

export default MyMessage;
