import { Form, Input, Button, message } from "antd";
import { Link } from "react-router-dom";
import "./SignIn.css";
import { validateEmail, validatePassword } from "../../../utils/validations";
import { signInApi } from "../../../api/users";
import { UserSignInInter } from "../../../types/users.types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { useNavigate } from "react-router-dom";
const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const handleSignInApi = async (values: UserSignInInter) => {
    try {
      const data = await signInApi(values, dispatch);
      if (data) {
        return navigate("/tasks");
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
      onFinish={handleSignInApi}
    >
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
        <span> Do Not Have an account? </span>
        <Link to="/signup">SignUp</Link>
      </Form.Item>
      <Form.Item className="button">
        <Button type="primary" htmlType="submit">
          Sign in
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignIn;
