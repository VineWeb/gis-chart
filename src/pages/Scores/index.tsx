import { Table } from 'antd';
import { getWuliScore2024, getLishiScore2024 } from '@/config';
import useGetData from '@/hooks/useGetData.ts';
import { Flex, Form, Cascader, Input } from 'antd';
import type { CascaderProps, GetProp } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
type DefaultOptionType = GetProp<CascaderProps, 'options'>[number];
interface IDataSource {
  id?: string,
  totalScore: number,
  persons: number,
  totalPersons: number,
  place: number
}
function Scores () {
  const [form] = Form.useForm();

  const [dataSource, setDataSource] = useState<IDataSource[]>([])
  const [orgionDataSource, setOrgionDataSource] = useState<IDataSource[]>([])
  const options = [
    { value: 'physics', label: '物理' },
    { value: 'history', label: '历史' },
  ]
  const [year, setYear] = useState<string>('2024');
  const [subject, setSubject] = useState<string>('physics');
  const [province, setProvince] = useState<string>('广西');
  const [score, setScore] = useState<number | undefined>(undefined);
  const [place, setPlace] = useState<number | undefined>(undefined);
  interface Option {
    value: string;
    label: string;
    children?: Option[];
    disabled?: boolean;
  }
  const wuliData = useGetData(getWuliScore2024);
  const lishiData = useGetData(getLishiScore2024);
  useEffect(() => {
    if (subject === 'physics' && wuliData && wuliData.data) {
      const dataSourceRes = wuliData.data.map((item: any) => {
        return {
          key: item.create_time,
          ...item
        }
      })
      setDataSource(dataSourceRes)
      setOrgionDataSource(dataSourceRes)
    } else if (subject === 'history' && lishiData && lishiData.data) {
      const dataSourceRes = lishiData.data.map((item: any) => {
        return {
          key: item.create_time,
          ...item
        }
      })
      setDataSource(dataSourceRes)
      setOrgionDataSource(dataSourceRes)
    }
    if (score) {
      const list = orgionDataSource.filter(item => item.totalScore === score)
      setDataSource(list)
    }
    if (place) {
      let list = orgionDataSource.filter(item =>  item.place >= place)
      if (list.length >= 0) {
        list = [list[0]]
      }
      setDataSource(list)
    }
  }, [subject, score, place, wuliData, lishiData])

  type AlignType = 'left' | 'right' | 'center';
  interface ColumnType<T> {
    key: string;
    title: string;
    dataIndex: string;
    align?: AlignType;
  }
  const columns : ColumnType<IDataSource>[] = [
    { key: '1', title: '总分', dataIndex: 'totalScore', align: 'center' },
    { key: '2', title: '人数', dataIndex: 'persons', align: 'center' },
    { key: '3', title: '累计人数', dataIndex: 'totalPersons', align: 'center' },
    { key: '4', title: '名次', dataIndex: 'place', align: 'center' },
  ]
  const onChange: CascaderProps<Option>['onChange'] = (value: any) => {
    console.log(value, 'value')
    if(value) {
      setSubject(String(value[0]));
    } else {
      setSubject('physics');
    }
  };
  const onChangeScore = (e: {target: {value: string}}) => {
    const val = e.target.value
    if (!val) {
      setScore(undefined)
    } else {
      setScore(Number(val))
    }
  }
  const onChangePlace = (e: {target: {value: string}}) => {
    const val = e.target.value
    if (!val) {
      setPlace(undefined)
    } else {
      setPlace(Number(val))
    }
  }
  const filter = (inputValue: string, path: DefaultOptionType[]) =>
  path.some(
    (option) => (option.label as string).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
  );

  const onCell = (item: any) => {
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
            <Input placeholder='选择年份' value={year} disabled/>
          </Form.Item>
          <Form.Item label="高考省份">
            <Input placeholder='高考省份' value={province} disabled/>
          </Form.Item>
          <Form.Item label="科目">
            <Cascader
              value={ subject ? [subject]: []}
              style={{width: 160}}
              options={options}
              onChange={onChange}
              placeholder="请选择"
              showSearch={{ filter }}
            />
          </Form.Item>
          <Form.Item label="高考分数">
            <Input placeholder='高考分数' value={score} onChange={onChangeScore}/>
          </Form.Item>
          <Form.Item label="高考排名">
            <Input placeholder='高考排名' value={place} onChange={onChangePlace}/>
          </Form.Item>
        </Form>
      </Flex>
      <Table onRow={(record) => { return {
        onClick: () => onCell(record) 
      }}} style={{margin: '0', alignContent: 'center'}} pagination={{showTotal: (total) => `总共: ${total} 条`}} dataSource={dataSource} columns={columns} />
    </>
  )
}

export default Scores;