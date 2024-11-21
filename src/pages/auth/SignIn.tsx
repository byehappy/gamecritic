import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ErrorAuth, login } from "../../redux/slice/authSlice";
import { Input, Button, Form } from "antd";
import { useForm } from "antd/es/form/Form";
export const SignInPage = () => {
  const [form] = useForm();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("from") ?? "/";
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  type FieldType = {
    login: string;
    password: string;
  };
  const navigation = useNavigate();
  const handleLogin = async (formValue: {
    login: string;
    password: string;
  }) => {
    const { login: username, password } = formValue;
    setLoading(true);

    try {
      await dispatch(login({ username, password })).unwrap();
    } catch (_error) {
      const e = _error as ErrorAuth;
      if (Array.isArray(e.error)) {
        form.setFields(
          e.error.map((err) => ({
            name: err.path,
            errors: [err.msg],
          }))
        );
      } else {
        form.setFields([{ name: e.path, errors: [e.error || ""] }]);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isLoggedIn) {
      navigation(redirectTo || "/");
    }
  }, [isLoggedIn, navigation, redirectTo]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2vh 0",
        width: "25vw",
        margin: "25vh auto",
      }}
    >
      <h1 style={{ fontSize: "2rem", margin: "0 auto" }}>Авторизация</h1>
      <Form
        form={form}
        labelCol={{ xs: { span: 24 }, sm: { span: 4 } }}
        wrapperCol={{ xs: { span: 24 }, sm: { span: 24 } }}
        initialValues={{ remember: true }}
        onFinish={handleLogin}
        autoComplete="off"
      >
        <Form.Item<FieldType> label="Логин" name="login">
          <Input
            placeholder="Логин"
            onChange={() => {
              form.setFields([{ name: "login", errors: [] }]);
            }}
          />
        </Form.Item>

        <Form.Item<FieldType> label="Пароль" name="password">
          <Input.Password
            placeholder="Пароль"
            onChange={() => {
              form.setFields([{ name: "password", errors: [] }]);
            }}
          />
        </Form.Item>

        <Form.Item
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2vw",
          }}
        >
          <Button type="primary" htmlType="submit" loading={loading}>
            Войти
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: "center" }}>
        Еще не зарегистрировались?{" "}
        <Link to="/auth/sign-up">Зарегистрироваться</Link>
      </div>
    </div>
  );
};
