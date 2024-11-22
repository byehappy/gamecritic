import { useMemo } from "react"

export const useWordDeclination = (
    n: number,
    strings: [string, string, string],
  ) => {
    const text = useMemo(() => {
      const words = [strings[0], strings[1], strings[2]]
  
      return words[
        n % 100 > 4 && n % 100 < 20
          ? 2
          : [2, 0, 1, 1, 1, 2][n % 10 < 5 ? n % 10 : 5]
      ]
    }, [n, strings])
  
    return { text }
  }