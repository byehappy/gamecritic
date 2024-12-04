import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  
`

export const ModalWindow = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  min-width: 25rem;
  max-width:70vw;
  padding: 1em;
`
export const ModalHeader = styled.div<{$haveHeader:boolean}>`
  display:flex;
  justify-content:${(props)=> props.$haveHeader ? "space-between" : "right"};
  font-size:1.5rem;
  margin-bottom:1vh;
`