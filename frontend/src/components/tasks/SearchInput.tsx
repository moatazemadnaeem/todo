import { Form, Input, Select, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import "./tasks.styles.css";
import { AppDispatch, RootState } from "../../store";
import { useState, useEffect } from "react";
import {
  autoCompleteTasksApi,
  getAllOrSpecificTasksApi,
} from "../../api/tasks";
import { useRef } from "react";
import { StatusEnum } from "../../types/tasks.types";
const { Search } = Input;
const { Option } = Select;

const SearchInput = () => {
  const [form] = Form.useForm();
  const ref = useRef<HTMLDivElement>(null);

  const [text, setText] = useState<string | null>(null);
  const [autoData, setAutoData] = useState<string[]>([]);
  const [statusTask, setStatusTask] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const pageNum = useSelector<RootState>((state) => state.tasks.page) as number;
  const triggerAct = useSelector<RootState>(
    (state) => state.tasks.triggerActionUser
  ) as boolean;

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllOrSpecificTasksApi(text, dispatch, pageNum, statusTask);
      } catch (error: any) {
        message.error(error);
      }
    };
    fetchData();
  }, [pageNum, triggerAct]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setAutoData([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const handleAutoComplete = async (text: string | null) => {
    try {
      const data = await autoCompleteTasksApi(text, dispatch);
      setAutoData(data);
    } catch (error: any) {
      message.error(error);
    }
  };
  const onFinish = async () => {
    try {
      await getAllOrSpecificTasksApi(text, dispatch, 1, statusTask);
      setAutoData([]);
      form.setFieldsValue({ content: text });
    } catch (error: any) {
      message.error(error);
    }
  };
  const handleSelect = (value: string) => {
    setText(value);
    form.submit();
  };
  useEffect(() => {
    form.setFieldsValue({ status: "all" });
  }, []);
  return (
    <Form className="search__input" form={form} onFinish={onFinish}>
      <Form.Item className="add__search__text" name="content">
        <Search
          placeholder="Enter text to search"
          onChange={(e) => {
            setText(e.target.value);
            handleAutoComplete(e.target.value);
          }}
          onSearch={() => form.submit()}
        />
      </Form.Item>
      <Form.Item className="search__status" name="status">
        <Select
          placeholder="Status"
          onChange={(val: string) => {
            setStatusTask(val);
            form.submit();
          }}
        >
          <Option value="all">All</Option>
          <Option value={StatusEnum.DONE}>Done</Option>
          <Option value={StatusEnum.IN_PROGRESS}>Pending</Option>
          <Option value={StatusEnum.NOT_STARTED}>Not Started</Option>
        </Select>
      </Form.Item>
      {autoData.length > 0 && (
        <div ref={ref} className="autocomplete-dropdown">
          {autoData.map((data, indx) => (
            <div
              key={indx}
              className="autocomplete-item"
              onClick={() => handleSelect(data)}
            >
              {data}
            </div>
          ))}
        </div>
      )}
    </Form>
  );
};

export default SearchInput;
