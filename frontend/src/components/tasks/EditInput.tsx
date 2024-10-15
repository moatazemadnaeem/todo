import { Form, Input, Select, message } from "antd";
import { useDispatch } from "react-redux";
import { editTask } from "../../store/features/tasks/createTaskSlice";
import "./tasks.styles.css";
import { AppDispatch } from "../../store";
import { IsEditTaskInter, StatusEnum } from "../../types/tasks.types";
import { useEffect } from "react";
import { EditTaskValues } from "../../types/tasks.types";
import { editTasksApi } from "../../api/tasks";
const { Option } = Select;
const EditInput = ({
  content,
  _id,
  status,
  setIsEditing,
  ic_flag,
}: IsEditTaskInter) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const onFinish = async (values: EditTaskValues, ic_flag: boolean) => {
    try {
      if (ic_flag && "edit_icon" in values) {
        dispatch(
          editTask({
            content: content,
            _id,
            status: values.edit_icon as StatusEnum,
          })
        );
        await editTasksApi(
          {
            content: content,
            taskId: _id,
            status: values.edit_icon as StatusEnum,
          },
          dispatch
        );
      }
      if (!ic_flag && "edit_content" in values) {
        dispatch(editTask({ content: values.edit_content, _id, status }));
        await editTasksApi(
          {
            content: values.edit_content,
            taskId: _id,
            status,
          },
          dispatch
        );
      }
    } catch (error: any) {
      message.error(error);
    }

    setIsEditing(false);
  };
  useEffect(() => {
    form.setFieldsValue({ edit_content: content });
    form.setFieldsValue({ edit_icon: status });
  }, []);
  const handleSelectChange = () => {
    form.submit(); // Trigger form submission
  };
  return ic_flag === true ? (
    <Form
      className="form__edit__icon"
      form={form}
      onFinish={(vals) => onFinish(vals, ic_flag)}
    >
      <Form.Item name="edit_icon">
        <Select
          placeholder="Select a option and change input text above"
          onChange={handleSelectChange}
        >
          <Option value={StatusEnum.NOT_STARTED}>
            {StatusEnum.NOT_STARTED}
          </Option>
          <Option value={StatusEnum.IN_PROGRESS}>
            {StatusEnum.IN_PROGRESS}
          </Option>
          <Option value={StatusEnum.DONE}>{StatusEnum.DONE}</Option>
        </Select>
      </Form.Item>
    </Form>
  ) : (
    <Form
      className="form__edit__content"
      form={form}
      onFinish={(vals) => onFinish(vals, ic_flag)}
    >
      <Form.Item name="edit_content">
        <Input value={content} />
      </Form.Item>
    </Form>
  );
};

export default EditInput;
