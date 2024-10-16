import { Form, Input, Button, message } from "antd";
import { useDispatch } from "react-redux";
import "./tasks.styles.css";
import { AppDispatch } from "../../store";
import { createTasksApi } from "../../api/tasks";
import { useState } from "react";
const FormInput = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(false);
  const onFinish = async (values: { content: string }) => {
    try {
      setLoading(true);
      await createTasksApi(
        {
          content: values.content,
        },
        dispatch
      );
      form.resetFields();
    } catch (error: any) {
      message.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={onFinish} className="input__task">
      <Form.Item className="add__input__task" name="content">
        <Input placeholder="Enter your task here" />
      </Form.Item>
      <Button
        loading={loading}
        className="btn__task"
        type="primary"
        htmlType="submit"
      >
        Add Task
      </Button>
    </Form>
  );
};

export default FormInput;
