import { Button, Form, Input } from "antd";

export const SignInPage = () => {
  return (
    <div style={{ margin: "30vh 30vw",display:"flex",flexDirection:"column",gap:"2vh 0",textAlign:"center" }}>
      <h1>Авторизация</h1>
      <Form
        name="basic"
        style={{ maxWidth: "25vw" }}
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
          label="Пароль"
          name="password"
          rules={[{ required: true, message: "Введите свой пароль" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Вход
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
