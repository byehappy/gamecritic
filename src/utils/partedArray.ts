export const partArray = <T>(array:T[],size:number):T[][] => {
    const chunk:T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunk.push(array.slice(i, i + size));
    }
    return chunk;
  };