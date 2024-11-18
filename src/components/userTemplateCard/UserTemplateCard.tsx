import { Link } from "react-router-dom";
import styled from "styled-components";

export const Item = styled(Link)`
  width: 130px;
  position: relative;
  flex: none;
  height:20vh;
  transition: transform 0.3s ease-in-out;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
  span {
    padding: 5px;
    text-align: center;
    position: absolute;
    bottom: 0;
    left:0;
    width: 100%;
    color: white;
    line-height: 22px;
    background-color: black;
  }
`;
export const UserTemplateCard: React.FC<{
  img: string;
  name: string;
  id: string;
}> = ({ img, name, id }) => {
  return (
    <Item to={`/tier-list/${id}`}>
      <img src={img} alt={name} />
      <span>{name}</span>
    </Item>
  );
};
