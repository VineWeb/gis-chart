import { Table } from 'antd';
import { getGuangzhouYuea } from '@/config';
import useGetData from '@/hooks/useGetData.ts';
import { Flex, Form, Cascader } from 'antd';
import type { CascaderProps, GetProp } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
type DefaultOptionType = GetProp<CascaderProps, 'options'>[number];
interface IDataSource {
  id?: number;
  create_time: string,
  person_lowest_price: string,
  person_highest_price: string,
  unit_lowest_price: string,
  unit_highest_price: string,
}
function YueA () {
  const [form] = Form.useForm();
  const data = useGetData(getGuangzhouYuea);
  const [dataSource, setDataSource] = useState<IDataSource[]>([])
  const [orgionDataSource, setOrgionDataSource] = useState<IDataSource[]>([])
  const currentYear = dayjs().year()
  const options = Array.from({length: currentYear-2012+1}, (_, index: number) => {
    return {
      value: String(currentYear-index),
      label: String(currentYear-index),
    }
  })
  const [year, setYear] = useState<string>('');
  interface Option {
    value: string;
    label: string;
    children?: Option[];
    disabled?: boolean;
  }
  useEffect(() => {
    if (data && data.data) {
      const dataSourceRes = data.data.map((item: any) => {
        return {
          key: item.create_time,
          ...item
        }
      })
      setDataSource(dataSourceRes)
      setOrgionDataSource(dataSourceRes)
    }
  }, [data])

  let columns = [
    { key: '1', title: '竞价时间', dataIndex: 'create_time' },
    { key: '2', title: '个人最低成交价', dataIndex: 'person_lowest_price' },
    { key: '3', title: '个人平均成交价', dataIndex: 'person_highest_price' },
    { key: '4', title: '单位最低成交价', dataIndex: 'unit_lowest_price' },
    { key: '5', title: '单位平均成交价', dataIndex: 'unit_highest_price' },
  ]
  useEffect(() => {
    handleDataSource()
  }, [year])
  const handleDataSource = () => {
    const list = orgionDataSource.filter(item => item.create_time.includes(year))
    setDataSource(list)
  }
  const onChange: CascaderProps<Option>['onChange'] = (value: any) => {
    console.log(value, 'value')
    if(value) {
      setYear(String(value[0]));
    } else {
      setYear('')
    }
  };
  const filter = (inputValue: string, path: DefaultOptionType[]) =>
  path.some(
    (option) => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
  );

  const onCell = (item: IDataSource) => {
    console.log(item, 'IDataSource')
  }
  return (
    <>
      <Flex style={{'padding': "20px 0", 'backgroundColor': '#fee4d3'}} justify='left'>
        <Form
          form={form}
          layout={'inline'}
          style={{ maxWidth: 'none', paddingLeft: '20px'}}
        >
          <Form.Item label="选择年份">
            <Cascader
              value={year ? [year] : []}
              style={{width: 160}}
              options={options}
              onChange={onChange}
              placeholder="请选择"
              showSearch={{ filter }}
            />
          </Form.Item>
        </Form>
      </Flex>
      <Table onRow={(record) => { return {
        onClick: () => onCell(record) 
      }}} style={{margin: '0'}} pagination={{showTotal: (total) => `总共: ${total} 条`}} dataSource={dataSource} columns={columns} />
    </>
  )
}

export default YueA