import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../../redux/slice/authSlice";
import { Input, Button, Form } from "antd";

export const SignInPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("from") ?? "/";
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  type FieldType = {
    username: string;
    password: string;
  };
  const navigation = useNavigate();
  const handleLogin = (formValue: { username: string; password: string }) => {
    const { username, password } = formValue;
    setLoading(true);

    dispatch(login({ username, password })).finally(() => setLoading(false));
  };
  useEffect(()=>{
    if (isLoggedIn) {
      navigation(redirectTo || "/");
    }
  },[isLoggedIn, navigation, redirectTo])

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
        labelCol={{ xs: { span: 24 }, sm: { span: 4 } }}
        wrapperCol={{ xs: { span: 24 }, sm: { span: 24 } }}
        initialValues={{ remember: true }}
        onFinish={handleLogin}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Логин"
          name="username"
          rules={[{ required: true, message: "Введите свой логин" }]}
        >
          <Input placeholder="Логин" />
        </Form.Item>

        <Form.Item<FieldType>
          label="Пароль"
          name="password"
          rules={[
            { required: true, message: "Это поле обязательно для заполнения" },
          ]}
        >
          <Input.Password placeholder="Пароль" />
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
