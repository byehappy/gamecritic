import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { ErrorAuth, register } from "../../redux/slice/authSlice";
import { Link, Navigate } from "react-router-dom";
import { Input, Button, Form } from "antd";
import { setMessage } from "../../redux/slice/messageSlice";
import { useForm } from "antd/es/form/Form";

export const SignUpPage = () => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const [successful, setSuccessful] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [form] = useForm();
  type FieldType = {
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
  };

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
      .catch((_error) => {
        const e = _error as ErrorAuth;
        console.log(e);
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
        setSuccessful(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  if (isLoggedIn) {
    return <Navigate to="/" />;
  }
  if (successful) {
    dispatch(setMessage({ message: "Вы успешно зарегистрировались" }));
    return <Navigate to="/auth/sign-in" />;
  }

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
      <Form
        form={form}
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
          <Input
            placeholder="Почта"
            onChange={() => {
              form.setFields([{ name: "email", errors: [] }]);
            }}
          />
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
          <Input
            placeholder="Логин"
            onChange={() => {
              form.setFields([{ name: "username", errors: [] }]);
            }}
          />
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
          <Input.Password
            placeholder="Пароль"
            onChange={() => {
              form.setFields([{ name: "password", errors: [] }]);
            }}
          />
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
          <Input.Password placeholder="Подтверждение пароля" />
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
      <div style={{ textAlign: "center" }}>
        Уже зарегистрировались?
        <Link to="/auth/sign-in"> Войти</Link>
      </div>
    </div>
  );
};
