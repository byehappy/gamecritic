import { Col } from "antd";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  border: 1px solid white;
`;
const RowHeader = styled(Col)`
  display: flex;
  min-height: 9.5rem;
  width: 10vw;
  animation: slider 1.8s linear infinite forwards;
  background: linear-gradient(to right, #e6e6e6 8%, #ececec 18%, #e6e6e6 33%);
  background-size: 1200px 100%;
  border-right: 1px solid white;
  @keyframes slider {
    0% {
      background-position: -1200px 0;
    }
    100% {
      background-position: 1200px 0;
    }
  }
`;

const DroppableWrapper = styled.div`
  min-height: 12rem;
  width: 100%;
  animation: slider 1.8s linear infinite forwards;
  background: linear-gradient(to right, #e6e6e6 8%, #ececec  18%, #e6e6e6 33%);
  background-size: 1200px 100%;

  @keyframes slider {
    0% {
      background-position: -1200px 0;
    }
    100% {
      background-position: 1200px 0;
    }
  }
`;
export const TableSkeleton = () => {
  return (
    <Container>
      <RowHeader />
      <DroppableWrapper />
    </Container>
  );
};
