import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import {
  validateName,
  validateEmail,
  validatePassword,
} from "../../../utils/validations";
import { UserSignUpInter } from "../../../types/users.types";
import { signUpUserApi } from "../../../api/users";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
const SignUp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const handleSignUpApi = async (values: UserSignUpInter) => {
    try {
      const data = await signUpUserApi(values, dispatch);
      if (data && data.status) {
        return navigate("/");
      }
    } catch (error: any) {
      message.error(error);
    }
  };
  return (
    <Form
      className="signin"
      name="signin_form"
      layout="vertical"
      onFinish={handleSignUpApi}
    >
      <Form.Item
        className="name"
        name="name"
        label="Name"
        rules={[
          {
            validator: validateName,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        className="email"
        name="email"
        label="Email"
        rules={[
          {
            validator: validateEmail,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        className="password"
        name="password"
        label="Password"
        rules={[
          {
            validator: validatePassword,
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item className="link">
        <span>Already Have An Account? </span>
        <Link to="/">SignIn</Link>
      </Form.Item>
      <Form.Item className="button">
        <Button type="primary" htmlType="submit">
          Sign up
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignUp;
