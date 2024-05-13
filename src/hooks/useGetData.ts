
import { useCallback, useEffect, useState } from 'react';
export default function useGetData<T>(fn: () => Promise<T>): T | undefined {
  const [data, setData] = useState<T| undefined>()
  const stableFn = useCallback(fn, []);
  useEffect(() => {
    async function getData() {
      const res = await stableFn()
      setData(res)
    }
    getData()
  }, [stableFn])
  return data
}