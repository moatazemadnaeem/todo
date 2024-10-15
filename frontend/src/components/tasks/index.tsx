import FormInput from "./FormInput";
import SearchInput from "./SearchInput";
import TableTasks from "./TableTasks";
const Todo = () => {
  return (
    <div className="tasks__container">
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
    </div>
  );
};

export default Todo;
