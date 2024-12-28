import styled from "styled-components";

export const ModalOverlay = styled.div<{$zIndex:number}>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${(props)=> props.$zIndex}
`

export const ModalWindow = styled.div<{$widthMin:boolean}>`
  background: ${({theme})=> theme.colors.bg};
  color:${({theme})=>theme.colors.font};
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  min-width: 320px;
  max-width:75%;
  padding: 1em;
  width:${(props)=> props.$widthMin ?  "min-content" : "auto"};
`
export const ModalHeader = styled.div<{$haveHeader:boolean}>`
  display:flex;
  justify-content:${(props)=> props.$haveHeader ? "space-between" : "right"};
  font-size:1.5rem;
  margin-bottom:1vh;
`