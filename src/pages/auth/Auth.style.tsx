import { Button } from "antd";
import styled from "styled-components";

export const FieldInput = styled.input`
  background: white;
  border: .1px solid #9f9f9f;
  border-radius: .5vw;
  width: 25vw;
  padding: .8vh .6vw;
  margin-top: .5vw;
  font-size:1rem;
`
export const Submit = styled(Button)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.3rem;
  margin-top: 1vw;
  border-radius: 1vw;
  padding:2vh 2vw;
`
export const FieldContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size:1.1rem;

  .ErrorMessages {
    color: red;
    font-size: 1vw;
  }
`