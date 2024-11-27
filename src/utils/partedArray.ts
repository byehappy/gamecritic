export const partArray = <T>(array:T[],size:number):T[][] => {
    const partedArray:T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      partedArray.push(array.slice(i, i + size));
    }
    return partedArray;
  };