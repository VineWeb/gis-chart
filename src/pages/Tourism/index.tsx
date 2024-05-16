import { Table } from 'antd';
import { getColumns, getDataSource } from '@/config';
import useGetData from '@/hooks/useGetData.ts';
import { Flex, Form, Input, Cascader } from 'antd';
import type { CascaderProps, GetProp } from 'antd';
import { useEffect, useState } from 'react';
type DefaultOptionType = GetProp<CascaderProps, 'options'>[number];
interface IDataSource {
  id?: number;
  key: string,
  name: string,
  provinceName: string,
  year: string,
  lng: string,
  lat: string,
  center: [number, number] | [null, null],
}
function Tourism () {
  const [form] = Form.useForm();
  const data = useGetData(getDataSource);
  const coldata = useGetData(getColumns);
  const [orgionDataSource, setOrgionDataSource] = useState<IDataSource[]>([])
  const [dataSource, setDataSource] = useState<IDataSource[]>([])
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    province: '',
  });
  interface Option {
    value: string;
    label: string;
    children?: Option[];
    disabled?: boolean;
  }
  const [options, setOptions] = useState<Option[]>([])
  useEffect(() => {
    if (data && data.list) {
      const dataSourceRes = data.list.map((item: IDataSource) => (
        {
          key: item.id,
          name: item.name,
          provinceName: item.provinceName,
          year: item.year,
          lng: item.lng,
          lat: item.lat,
          center: item.center
        }
      ))
      setDataSource(dataSourceRes)
      setOrgionDataSource(dataSourceRes)
      const uniqueProvinces = new Set()
      const optionsData = dataSourceRes.reduce((acc: any[], item: {provinceName: string}) => {
        if(!uniqueProvinces.has(item.provinceName)) {
          uniqueProvinces.add(item.provinceName)
          acc.push({
            value: item.provinceName,
            label: item.provinceName,
          })
        }
        return acc
      }, [])
      setOptions(optionsData)
    }
  }, [data])

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
  useEffect(() => {
    handleDataSource()
  }, [searchFilters])
  const handleDataSource = () => {
    const { keyword, province } = searchFilters
    const list = orgionDataSource.filter(item => item.name.includes(keyword))
    const result = province ? list.filter(item => item.provinceName === province) : list
    setDataSource(result)
  }
  const onChangeKeyword = (e: {target: {value: string}}) => {
    const value = e.target.value
    setSearchFilters(prev => ({ ...prev, keyword: value }));
  }
  const onChange: CascaderProps<Option>['onChange'] = (value) => {
    setSearchFilters(prev => ({ ...prev, province: value ? value[0] : '' }));
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
      <Flex style={{'padding': "20px 0", 'backgroundColor': '#fee4d3'}} justify='center'>
        <Form
        form={form}
        layout={'inline'}
        style={{ maxWidth: 'none'}}
      >
        <Form.Item label="景区名称">
          <Input placeholder="请输入景区名称" onChange={onChangeKeyword} value={searchFilters.keyword}/>
        </Form.Item>
        <Form.Item label="选择地区">
          <Cascader
            value={searchFilters.province ? [searchFilters.province] : []}
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

export default Tourism