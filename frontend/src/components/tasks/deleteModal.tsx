import { Modal, Button, message } from "antd";
import { TaskInter } from "../../types/tasks.types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { deleteTasksApi } from "../../api/tasks";
const DeleteModal = ({
  isModalVisible,
  setIsModalVisible,
  record,
}: {
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  record: TaskInter | null;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleOk = () => {
    if (record) {
      handleDeleteTask(record);
      setIsModalVisible(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleDeleteTask = async (record: TaskInter) => {
    try {
      await deleteTasksApi({ taskId: record._id }, dispatch, record._id);
    } catch (error: any) {
      message.error(error);
    }
  };
  return (
    <Modal
      title="Delete Task"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Submit
        </Button>,
      ]}
    >
      <span>Are You Sure You Want To Delete The Task?</span>
    </Modal>
  );
};

export default DeleteModal;
