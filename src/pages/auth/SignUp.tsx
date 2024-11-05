import { Button, Form, Input } from "antd";

export const SignUpPage = () => {
  return (
    <div
      style={{
        margin: "25vh 25vw",
        display: "flex",
        flexDirection: "column",
        gap: "2vh 0",
        textAlign: "center",
      }}
    >
      <h1>Регистрация</h1>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <Form.Item
          label="Логин"
          name="username"
          rules={[{ required: true, message: "Введите свой логин" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Почта"
          name="email"
          rules={[
            { required: true, message: "Введите свою почту" },
            {
              type: "email",
              message: "Введенный адрес электронной почты неверен! ",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Пароль"
          name="password"
          rules={[{ required: true, message: "Введите свой пароль" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
        name="confirm"
        label="Подтвердите пароль"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Повторите свой пароль',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Пароли не совподают'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Зарегистрироваться
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
