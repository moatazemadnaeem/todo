import { Table, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { StatusEnum, TaskInter } from "../../types/tasks.types";
import { useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  LoadingOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import EditInput from "./EditInput";
import DeleteModal from "./deleteModal";
import { AppDispatch } from "../../store";
import { setPageTask } from "../../store/features/tasks/createTaskSlice";
const TableTasks = () => {
  const tasks = useSelector<RootState>(
    (state) => state.tasks.list
  ) as TaskInter[];
  const tasksSize = useSelector<RootState>(
    (state) => state.tasks.arrSize
  ) as number;
  const currTasksPage = useSelector<RootState>(
    (state) => state.tasks.page
  ) as number;
  const loadingTasks = useSelector<RootState>(
    (state) => state.tasks.loading
  ) as boolean;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<TaskInter | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const showDeleteModal = (record: TaskInter) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "Tasks",
      dataIndex: "content",
      key: "content",
      render: (text: string, record: TaskInter) => (
        <div className="base__tb">
          {isEditing && selectedRow === record._id ? (
            <EditInput
              content={record.content}
              _id={record._id}
              status={record.status}
              setIsEditing={setIsEditing}
              ic_flag={false}
            />
          ) : (
            <span>{text}</span>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: StatusEnum, record: TaskInter) => (
        <div className="base__tb">
          {isEditing && selectedRow === record._id ? (
            <EditInput
              content={record.content}
              _id={record._id}
              status={record.status}
              setIsEditing={setIsEditing}
              ic_flag={true}
            />
          ) : (
            <span>
              {text === StatusEnum.NOT_STARTED ? (
                <CloseCircleOutlined style={{ color: "var(--errorColor)" }} />
              ) : text === StatusEnum.IN_PROGRESS ? (
                <LoadingOutlined />
              ) : (
                <CheckCircleOutlined style={{ color: "var(--successColor)" }} />
              )}
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Edit",
      dataIndex: "edit",
      key: "edit",
      render: (_: string, record: TaskInter) => (
        <div
          onClick={() => {
            setIsEditing(!isEditing);
            setSelectedRow(record._id);
          }}
          className="base__tb ic__btn"
        >
          <EditOutlined />
        </div>
      ),
    },
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
      render: (_: string, record: TaskInter) => (
        <div
          className="base__tb ic__btn"
          onClick={() => showDeleteModal(record)}
        >
          <DeleteOutlined style={{ color: "var(--errorColor)" }} />
        </div>
      ),
    },
  ];
  const paginationConfig = {
    current: currTasksPage,
    pageSize: 5,
    total: tasksSize,
    onChange: (page: number) => {
      dispatch(setPageTask(page));
    },
  };
  return (
    <>
      <Table
        className="table__tasks"
        columns={columns}
        dataSource={tasks}
        rowKey={(task: TaskInter) => task._id}
        pagination={paginationConfig}
        locale={{
          emptyText: loadingTasks ? (
            <Spin />
          ) : (
            <span className="no__data__tasks">
              No Data Add Tasks To Start See Them!
            </span>
          ),
        }}
      />
      <DeleteModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        record={selectedRecord}
      />
    </>
  );
};

export default TableTasks;
