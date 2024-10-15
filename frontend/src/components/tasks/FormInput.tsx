import { Form, Input, Button, message } from "antd";
import { useDispatch } from "react-redux";
import "./tasks.styles.css";
import { AppDispatch } from "../../store";
import { createTasksApi } from "../../api/tasks";
const FormInput = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const onFinish = async (values: { content: string }) => {
    try {
      await createTasksApi(
        {
          content: values.content,
        },
        dispatch
      );
      form.resetFields();
    } catch (error: any) {
      message.error(error);
    }
  };

  return (
    <Form form={form} onFinish={onFinish} className="input__task">
      <Form.Item className="add__input__task" name="content">
        <Input placeholder="Enter your task here" />
      </Form.Item>
      <Button className="btn__task" type="primary" htmlType="submit">
        Add Task
      </Button>
    </Form>
  );
};

export default FormInput;
