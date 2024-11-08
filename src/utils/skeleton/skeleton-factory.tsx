import uuid4 from 'uuid4'
import { CardSkeleton } from './Type/Card.skeleton';

type SkeletonType = "Card"

const types: Record<SkeletonType,React.FC> ={
    "Card":CardSkeleton
}

export function SkeletonFactory(count:number,type:SkeletonType):JSX.Element[] {
    const SkeletonComponent = types[type]
    return Array.from({length:count},()=> <SkeletonComponent key={uuid4()}/>)
}