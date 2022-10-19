import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import bridge from "../utils/erars/bridge";

const LoadingBackground = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  color: white;
  margin: auto;
`;

const Title = styled.h1`
  font-size: 3em;
`;
const Status = styled.p`
  text-align: center;
`;

function Launch() {
  const navigate = useNavigate();

  useEffect(() => {
    bridge.launch().then(() => navigate("/console"));
  }, []);

  return (
    <LoadingBackground>
      <Wrapper>
        <Title>erars-electron</Title>
        <Status>Loading...</Status>
      </Wrapper>
    </LoadingBackground>
  );
}

export default Launch;
