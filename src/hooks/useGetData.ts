
import { useEffect, useState } from 'react';
export default function useGetData<T>(fn: () => Promise<T>): T | undefined {
  const [data, setDate] = useState<T| undefined>()
  useEffect(() => {
    async function getData() {
      const res = await fn()
      setDate(res)
    }
    getData()
  }, [fn])
  return data
}