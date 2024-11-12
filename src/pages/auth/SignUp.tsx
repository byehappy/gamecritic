import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import * as Yup from "yup";
import { register } from "../../redux/slice/authSlice";
import { Link, Navigate } from "react-router-dom";
import { Input, Button, Form } from "antd";

export const SignUpPage = () => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  type FieldType = {
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Неверный формат email")
      .required("Это поле обязательно для заполнения"),
    password: Yup.string()
      .required("Это поле обязательно для заполнения")
      .min(6, "Пароль слишком короткий")
      .matches(/[a-zA-Z]/, "Используйте только латинские буквы a-z"),
    confirmPassword: Yup.string()
      .required("Это поле обязательно для заполнения")
      .oneOf([Yup.ref("password")], "Пароли не совпадают"),
    username: Yup.string()
      .required("Это поле обязательно для заполнения")
      .min(4, "Имя слишком короткое")
      .matches(/[a-zA-Z]/, "Используйте только латинские буквы a-z"),
  });

  const handleRegister = (formValue: {
    username: string;
    email: string;
    password: string;
  }) => {
    const { username, email, password } = formValue;
    setLoading(true);
    setSuccessful(false);

    dispatch(register({ username, email, password }))
      .unwrap()
      .then(() => {
        setSuccessful(true);
      })
      .catch(() => {
        setSuccessful(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  if (isLoggedIn) {
    return <Navigate to="/" />;
  }
  //переделать под antd
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "2vh 0",
        textAlign: "center",
        width: "25vw",
        margin: "20vh auto",
      }}
    >
      <h1 style={{ fontSize: "2rem" }}>Регистрация</h1>
      {!successful ? (
        <Form
          labelCol={{ xs: { span: 24 }, sm: { span: 8 } }}
          wrapperCol={{ xs: { span: 24 }, sm: { span: 24 } }}
          initialValues={{ remember: true }}
          onFinish={handleRegister}
          autoComplete="off"
        >
          <Form.Item
            hasFeedback
            name="email"
            label="E-mail"
            validateDebounce={1000}
            rules={[
              {
                type: "email",
                message: "Неверный формат email",
              },
              {
                required: true,
                message: "Введите свою почту",
              },
            ]}
          >
            <Input placeholder="Почта" />
          </Form.Item>
          <Form.Item<FieldType>
            hasFeedback
            label="Логин"
            name="username"
            validateDebounce={1000}
            rules={[
              { required: true, message: "Введите свой логин" },
              { min: 4, message: "Логин от 4 символов" },
            ]}
          >
            <Input placeholder="Логин" />
          </Form.Item>

          <Form.Item<FieldType>
            hasFeedback
            label="Пароль"
            name="password"
            validateDebounce={1000}
            rules={[
              {
                required: true,
                message: "Это поле обязательно для заполнения",
              },
              { min: 6, message: "Пароль от 6 символов" },
            ]}
          >
            <Input.Password placeholder="Пароль" />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Подтвердите пароль"
            dependencies={["password"]}
            hasFeedback
            validateDebounce={1000}
            rules={[
              {
                required: true,
                message: "Введите повторно свой пароль",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Пароли не совпадают"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2vw",
            }}
          >
            <Button type="primary" htmlType="submit" loading={loading}>
              Зарегистрироваться
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div>
          Вы успешно зарегистрировались.
          <Link to="/auth/sign-in">Войти</Link>
        </div>
      )}
      <div style={{ textAlign: "center" }}>
        Уже зарегистрировались?
        <Link to="/auth/sign-in"> Войти</Link>
      </div>
    </div>
  );
};
