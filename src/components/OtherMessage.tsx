import React, { FC } from "react";
import { Alert, Badge } from "react-bootstrap";

interface Props {
  text: string;
  name: string;
}

const OtherMessage: FC<Props> = ({ text, name }) => {
  return (
    <Alert
      className="d-flex flex-column flex-shrink-1"
      style={{ maxWidth: "90%", width: "max-content" }}
      variant="secondary"
    >
      <Badge className="fs-6" style={{ width: "max-content" }} bg="secondary">
        {name}
      </Badge>
      <div style={{ wordWrap: "break-word" }}>{text}</div>
    </Alert>
  );
};

export default OtherMessage;
