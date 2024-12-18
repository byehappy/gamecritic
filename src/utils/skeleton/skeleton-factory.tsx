import uuid4 from "uuid4";
import {
  AbouteCardSkeleton,
  CardSkeleton,
  CardSmallSkeleton,
} from "./Type/Card.skeleton";
import { TableSkeleton } from "./Type/Table.skeleton";
import { IconSkeleton } from "./Type/User.skeleton";
import { TemplateSkeleton } from "./Type/Template.skeleton";

type SkeletonType =
  | "Icon"
  | "AbouteCard"
  | "Card-small"
  | "Card"
  | "Table"
  | "Template"

const types: Record<SkeletonType, React.FC> = {
  Icon: IconSkeleton,
  AbouteCard: AbouteCardSkeleton,
  Card: CardSkeleton,
  "Card-small": CardSmallSkeleton,
  Table: TableSkeleton,
  Template: TemplateSkeleton
};

export function SkeletonFactory(
  count: number,
  type: SkeletonType
): JSX.Element[] {
  const SkeletonComponent = types[type];
  return Array.from({ length: count }, () => (
    <SkeletonComponent key={uuid4()} />
  ));
}
