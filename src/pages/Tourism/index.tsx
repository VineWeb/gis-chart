import { Table } from 'antd';
import { getColumns, getDataSource } from '@/config';
import useGetData from '@/hooks/useGetData.ts';
function Tourism () {
  const data = useGetData(getDataSource);
  const coldata = useGetData(getColumns);
  let dataSource = null
  if (data) {
    dataSource = data.list.map((item: any) => {
      return {
        key: item.id,
        name: item.name,
        provinceName: item.provinceName,
        year: item.year,
        dataIndex: item.attribute
      }
    })
  }
  let columns = null
  if (coldata) {
    columns = coldata.data.map((item: any) => {
      return {
        key: item.id,
        title: item.name,
        dataIndex: item.attribute,
        width: item.width
      }
    })
  }
  return (
    <>
      <Table dataSource={dataSource} columns={columns} />
    </>
  )
}

export default Tourism