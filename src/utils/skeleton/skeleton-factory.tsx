import uuid4 from 'uuid4'
import { CardSkeleton, CardSmallSkeleton } from './Type/Card.skeleton';
import { TableSkeleton } from './Type/Table.skeleton';

type SkeletonType = "Card-small" |"Card" | "Table"

const types: Record<SkeletonType,React.FC> ={
    "Card":CardSkeleton,
    "Card-small":CardSmallSkeleton,
    "Table":TableSkeleton
}

export function SkeletonFactory(count:number,type:SkeletonType):JSX.Element[] {
    const SkeletonComponent = types[type]
    return Array.from({length:count},()=> <SkeletonComponent key={uuid4()}/>)
}