import {
  Modal,
  Tabs,
  Form,
  Row,
  Col,
  Select,
  Input,
  InputNumber,
  Slider,
  Button,
  Upload,
  Radio,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import ColorInput from "../components/color-input";
const { Option } = Select;
const AddProductModal = (props) => {
  const { visible, onCancel, form, loading, onFinish, beforeUpload } = props;
  const [saleValue, setSaleValue] = useState(0);
  const [btnAddCheck, setBtnAddCheck] = useState(false);
  // * color
  const [colorList, setColorList] = useState(["#FFFF00"]);
  const onChange = (value) => {
    if (isNaN(value)) {
      return;
    }

    setSaleValue(value);
  };
  const onChangeSelect = (value) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Modal
        bodyStyle={{ marginLeft: "30px", marginRight: "30px" }}
        width={700}
        footer={null}
        visible={visible}
        title="Create New Product"
        onCancel={onCancel}
      >
        <Tabs defaultActiveKey="1" size="large">
          <Tabs.TabPane tab="Thông tin sản phẩm" key="1">
            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              className="row-col"
              autoComplete="off"
            >
              <Form.Item
                style={{ fontWeight: "600" }}
                className="username"
                label="Tên sản phẩm"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên sản phẩm!",
                  },
                ]}
              >
                <Input
                  style={{ border: "1px solid #C0C0C0", borderRadius: "10px" }}
                  placeholder="Tên sản phẩm"
                />
              </Form.Item>
              <Form.Item
                className="username"
                label="Giá gốc (đ)"
                style={{ fontWeight: "600" }}
                name="regularPrice"
              >
                <Input
                  type="number"
                  style={{ border: "1px solid #C0C0C0", borderRadius: "10px" }}
                  placeholder="Giá gốc"
                />
              </Form.Item>
              <Row gutter={[16, 8]}>
                <Col span={12}>
                  {" "}
                  <Form.Item
                    className="username"
                    label="Phần trăm giảm giá (%)"
                    style={{ fontWeight: "600" }}
                    name="sale"
                    hasFeedback
                  >
                    <Row>
                      <Col span={12}>
                        <Slider
                          min={0}
                          max={30}
                          onChange={onChange}
                          value={typeof saleValue === "number" ? saleValue : 0}
                          step={1}
                        />
                      </Col>
                      <Col span={4}>
                        <InputNumber
                          min={0}
                          max={30}
                          style={{
                            margin: "0 16px",
                            borderRadius: "10px",
                          }}
                          size="middle"
                          step={1}
                          value={saleValue}
                          onChange={onChange}
                        />
                      </Col>
                    </Row>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                className="username"
                label="Giá đã giảm (đ)"
                style={{ fontWeight: "600" }}
                name="salePrice"
              >
                <Input
                  style={{ border: "1px solid #C0C0C0", borderRadius: "10px" }}
                />
              </Form.Item>
              <Form.Item
                className="username"
                label="Thương hiệu"
                style={{ fontWeight: "600" }}
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn thương hiệu!",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select a person"
                  optionFilterProp="children"
                  onChange={onChangeSelect}
                  size="large"
                  onSearch={onSearch}
                  style={{ border: "1px solid #C0C0C0", borderRadius: "10px" }}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="tom">Tom</Option>
                </Select>
              </Form.Item>
              {/* color */}
              <Form.Item
                className="username"
                label="Màu sắc"
                style={{ fontWeight: "600" }}
                name="color"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                ]}
              >
                <ColorInput
                  colorList={colorList}
                  addButton={btnAddCheck}
                  addButtonOpen={() => setBtnAddCheck(true)}
                  handleClose={() => setBtnAddCheck(false)}
                />
              </Form.Item>
              <Form.Item
                className="username"
                label="Số lượng trong kho"
                style={{ fontWeight: "600" }}
                name="stock"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền số lượng sản phẩm trong kho!",
                  },
                ]}
              >
                <Input
                  type="number"
                  style={{ border: "1px solid #C0C0C0", borderRadius: "10px" }}
                  placeholder="Số lượng sản phẩm"
                />
              </Form.Item>
              <Form.Item
                className="username"
                label="Hình ảnh"
                style={{ fontWeight: "600" }}
                name="image"
                rules={[
                  {
                    required: true,
                    message: "Please input image category!",
                  },
                ]}
              >
                <Upload
                  beforeUpload={() => {
                    return false;
                  }}
                  accept=".png, .jpeg, .jpg"
                >
                  <Button
                    style={{
                      border: "1px solid #C0C0C0",
                      borderRadius: "10px",
                    }}
                    icon={<UploadOutlined />}
                  >
                    Click to Upload
                  </Button>
                </Upload>
              </Form.Item>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Thông số kỹ thuật" key="2">
            <Form
              form={form}
              onFinish={onFinish}
              className="row-col"
              autoComplete="off"
            >
              <Form.Item
                className="username"
                label="Màn hình"
                style={{ fontWeight: "600" }}
                name="screen"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền thông số màn hình!",
                  },
                ]}
              >
                <Input
                  style={{ border: "1px solid #C0C0C0", borderRadius: "10px" }}
                  placeholder="Thông số màn hình"
                />
              </Form.Item>
              <Form.Item
                className="username"
                label="Hệ điều hành"
                style={{ fontWeight: "600" }}
                name="OS"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền hệ điều hành!",
                  },
                ]}
              >
                <Input
                  style={{ border: "1px solid #C0C0C0", borderRadius: "10px" }}
                  placeholder="Hệ điều hành"
                />
              </Form.Item>
              <Form.Item
                className="username"
                label="Camera sau"
                style={{ fontWeight: "600" }}
                name="backCamera"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền thông số camera sau!",
                  },
                ]}
              >
                <Input
                  style={{ border: "1px solid #C0C0C0", borderRadius: "10px" }}
                  placeholder="Thông số camera sau"
                />
              </Form.Item>
              <Form.Item
                className="username"
                label="Camera trước"
                style={{ fontWeight: "600" }}
                name="frontCamera"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền thông số camera trước!",
                  },
                ]}
              >
                <Input
                  style={{ border: "1px solid #C0C0C0", borderRadius: "10px" }}
                  placeholder="Thông số camera trước"
                />
              </Form.Item>
              <Form.Item
                className="username"
                label="Chip"
                style={{ fontWeight: "600" }}
                name="cpu"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền thông số chip!",
                  },
                ]}
              >
                <Input
                  style={{ border: "1px solid #C0C0C0", borderRadius: "10px" }}
                  placeholder="Thông số chip"
                />
              </Form.Item>
              <Form.Item
                className="username"
                label="RAM"
                style={{ fontWeight: "600" }}
                name="ram"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền thông số RAM!",
                  },
                ]}
              >
                <Input
                  type="number"
                  style={{ border: "1px solid #C0C0C0", borderRadius: "10px" }}
                  placeholder="Thông số RAM"
                />
              </Form.Item>
              <Form.Item
                className="username"
                label="Dung lượng lưu trữ"
                style={{ fontWeight: "600" }}
                name="storage"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền dung lượng lưu trữ!",
                  },
                ]}
              >
                <Input
                  type="number"
                  style={{ border: "1px solid #C0C0C0", borderRadius: "10px" }}
                  placeholder="Dung lượng lưu trữ"
                />
              </Form.Item>
              <Form.Item
                className="username"
                label="Sim"
                style={{ fontWeight: "600" }}
                name="sim"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền thông số sim!",
                  },
                ]}
              >
                <Input
                  style={{ border: "1px solid #C0C0C0", borderRadius: "10px" }}
                  placeholder="Thông số sim"
                />
              </Form.Item>
              <Form.Item
                className="username"
                label="Pin & Sạc"
                style={{ fontWeight: "600" }}
                name="batteryPowerAndCharger"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng điền thông số Pin & Sạc!",
                  },
                ]}
              >
                <Input
                  style={{ border: "1px solid #C0C0C0", borderRadius: "10px" }}
                  placeholder="Thông số Pin & Sạc"
                />
              </Form.Item>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Mô tả sản phẩm" key="3">
            Mô tả sản phẩm
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </div>
  );
};

export default AddProductModal;
