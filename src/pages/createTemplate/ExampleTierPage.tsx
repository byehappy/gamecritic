import styled from "styled-components";
import { useAppSelector } from "../../redux/hooks";
import { Button, Col, Popover, Row } from "antd";
import { Filter } from "../../components/filter/Filter";
import Search from "antd/es/input/Search";
import { FilterOutlined } from "@ant-design/icons";
import { CardGame } from "../../components/card/Card";
import { SkeletonFactory } from "../../utils/skeleton/skeleton-factory";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  border: 1px solid black;
`;
const RowHeader = styled(Col)`
  display: flex;
  min-height: 9.5rem;
  width: 10vw;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
`;
type FormValueType = {
  rows: {
    id: string;
    name: string;
    color: string;
  }[];
  name: string;
};
export const ExampleTierPage: React.FC<{
  formValues: FormValueType;
}> = ({ formValues: { rows, name } }) => {
  const createTemplate = useAppSelector((state) => state.createTemplate);

  return (
    <>
      <h1
        style={{
          margin: "1vw 0",
          width: "100%",
          textAlign: "center",
          color: "#2e2532",
        }}
      >
        {name}
      </h1>
      {rows.map((tier) => (
        <Container key={tier.id} id={tier.id}>
          <RowHeader style={{ backgroundColor: tier.color }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                wordBreak: "break-all",
              }}
            >
              <span style={{ textAlign: "center", display: "inline-block" }}>
                {tier.name}
              </span>
            </div>
          </RowHeader>
        </Container>
      ))}
      <div
        style={{
          display: "flex",
          gap: "1vh",
          marginTop: "3vh",
          marginBottom: "1vh",
        }}
      >
        <Search
          placeholder="Введите название игры"
          enterButton="Поиск"
          size="large"
        />
        <Popover
          content={<Filter filters={createTemplate.filters} />}
          placement="bottom"
          trigger="click"
          title={"Фильтры"}
        >
          <Button size="large" type="primary" icon={<FilterOutlined />} />
        </Popover>
      </div>
      <Row
        style={{
          display: "grid",
          gridTemplateColumns: " repeat(auto-fit, minmax(130px,1fr)",
          gap: "1rem",
        }}
      >
        {!createTemplate.pickGame
          ? SkeletonFactory(10, "Card")
          : createTemplate.pickGame.map((game) => (
              <CardGame key={game.id} game={game} id={game.id} />
            ))}
      </Row>
    </>
  );
};
