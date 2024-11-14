import uuid4 from 'uuid4'
import { CardSkeleton } from './Type/Card.skeleton';
import { TableSkeleton } from './Type/Table.skeleton';

type SkeletonType = "Card" | "Table"

const types: Record<SkeletonType,React.FC> ={
    "Card":CardSkeleton,
    "Table":TableSkeleton
}

export function SkeletonFactory(count:number,type:SkeletonType):JSX.Element[] {
    const SkeletonComponent = types[type]
    return Array.from({length:count},()=> <SkeletonComponent key={uuid4()}/>)
}