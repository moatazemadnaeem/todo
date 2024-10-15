import { Form, Input, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import "./tasks.styles.css";
import { AppDispatch, RootState } from "../../store";
import { useState, useEffect } from "react";
import {
  autoCompleteTasksApi,
  getAllOrSpecificTasksApi,
} from "../../api/tasks";
const { Search } = Input;

const SearchInput = () => {
  const [form] = Form.useForm();

  const [text, setText] = useState<string | null>(null);
  const [autoData, setAutoData] = useState<string[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const pageNum = useSelector<RootState>((state) => state.tasks.page) as number;

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllOrSpecificTasksApi(text, dispatch, pageNum);
      } catch (error: any) {
        message.error(error);
      }
    };
    fetchData();
  }, [pageNum]);

  const handleAutoComplete = async (text: string) => {
    try {
      const data = await autoCompleteTasksApi(text, dispatch);
      setAutoData(data);
    } catch (error: any) {
      message.error(error);
    }
  };

  const onFinish = async () => {
    try {
      await getAllOrSpecificTasksApi(text, dispatch, pageNum);
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
  return (
    <Form className="search__input" form={form} onFinish={onFinish}>
      <Form.Item className="add__search__text" name="content">
        <Search
          placeholder="Enter text to search"
          onChange={(e) => {
            handleAutoComplete(e.target.value);
          }}
          onSearch={() => form.submit()}
        />
      </Form.Item>
      {autoData.length > 0 && (
        <div className="autocomplete-dropdown">
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
