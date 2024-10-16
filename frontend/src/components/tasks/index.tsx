import { Button } from "antd";
import { AppDispatch, RootState } from "../../store";
import FormInput from "./FormInput";
import SearchInput from "./SearchInput";
import TableTasks from "./TableTasks";
import { useSelector, useDispatch } from "react-redux";
import { logout_user } from "../../store/features/users/createUserSlice";
import { redirect } from "react-router-dom";
const Todo = () => {
  const name = useSelector<RootState>(
    (state) => state.user.user?.name
  ) as string;
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="tasks__container">
      <span className="welcome__todo">
        Welcome {name}, Start Add Tasks Now 😄
      </span>
      <div className="tasks">
        <div className="input__task__container">
          {/* Input to search tasks */}
          <SearchInput />
          {/* Input To add task  */}
          <FormInput />
        </div>
        {/* Table to show tasks */}
        <TableTasks />
      </div>
      <Button
        onClick={() => {
          dispatch(logout_user());
          window.location.reload();
        }}
        className="signout__user"
      >
        Sign Out
      </Button>
    </div>
  );
};

export default Todo;
