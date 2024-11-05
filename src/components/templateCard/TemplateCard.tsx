import { Item } from "./TemplateCard.style"

export const TemplateCard:React.FC<{img:string,name:string,slug:string}> = ({img,name,slug}) => {
    return <Item to={`/tier-list/${slug}`}>
    <img
      src={img}
      alt={name}
    />
    <span>{name}</span>
  </Item>
}