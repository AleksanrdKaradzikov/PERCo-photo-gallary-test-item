import React from 'react';
import { Form, Button, Input } from "antd";

const { TextArea } = Input;

const Editor = ({ onChange, handleSubmit, submitting, value }) => (
  <div>

    <Form.Item>
      <Input  value={value.name}
              onChange={onChange}
              placeholder="Ваше имя"
              name="name"/>
    </Form.Item>
    <Form.Item>
      <TextArea placeholder="Комментарий"
                name="content"
                rows={4} onChange={onChange} value={value.content} />
    </Form.Item>
    <Form.Item>
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={handleSubmit}
        type="primary"
      >
        Комментировать
      </Button>
    </Form.Item>
  </div>
);

export default Editor;
