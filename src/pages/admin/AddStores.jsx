import { useState } from "react";
import { Form, Input, Select, Button, Card, Row, Col, message, Steps, Upload } from "antd";
import { ArrowLeftOutlined, UploadOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function AddStore() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedImage, setUploadedImage] = useState(null);

  const zones = [
    { value: 'south', label: '🔴 South Delhi' },
    { value: 'north', label: '🟢 North Delhi' },
    { value: 'east', label: '🔵 East Delhi' },
    { value: 'west', label: '🟡 West Delhi' },
    { value: 'central', label: '⚫ Central Delhi' },
    { value: 'gurugram', label: '🟠 Gurugram' },
    { value: 'noida', label: '⭐ Noida' }
  ];

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage({
        name: file.name,
        preview: e.target.result
      });
    };
    reader.readAsDataURL(file);
    return false;
  };

  const handleSave = (values) => {
    try {
      console.log('Store created:', {
        ...values,
        image: uploadedImage?.preview || null
      });
      message.success('Store created successfully!');
      setTimeout(() => navigate('/stores'), 1000);
    } catch (error) {
      message.error('Failed to create store');
    }
  };

  const steps = [
    { title: 'Store Info', description: 'Basic details' },
    { title: 'Location', description: 'Address details' },
    { title: 'Contact', description: 'Phone & Manager' },
    { title: 'Hours', description: 'Timing details' }
  ];

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/stores')}
        >
          Back
        </Button>
        <h2 style={{ margin: 0 }}>Add New Store</h2>
      </div>

      <Steps current={currentStep} items={steps} style={{ marginBottom: 24 }} />

      <Form form={form} layout="vertical" onFinish={handleSave}>
        {/* Step 1 - Store Info */}
        {currentStep === 0 && (
          <Card title="Store Information" style={{ marginBottom: 24 }}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item 
                  name="name" 
                  label="Store Name" 
                  rules={[{ required: true, message: 'Please enter store name' }]}
                >
                  <Input placeholder="e.g. South Delhi Store" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item 
                  name="code" 
                  label="Store Code" 
                  rules={[{ required: true, message: 'Please enter store code' }]}
                >
                  <Input placeholder="e.g. SDEL-001" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item 
                  name="zone" 
                  label="Zone" 
                  rules={[{ required: true, message: 'Please select zone' }]}
                >
                  <Select placeholder="Select zone" size="large">
                    {zones.map(z => (
                      <Select.Option key={z.value} value={z.value}>
                        {z.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item 
                  name="city" 
                  label="City" 
                  rules={[{ required: true, message: 'Please enter city' }]}
                >
                  <Input placeholder="e.g. New Delhi" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Store Image">
              <div style={{ 
                border: '2px dashed #1890ff', 
                borderRadius: 8, 
                padding: 20, 
                textAlign: 'center',
                background: '#fafafa'
              }}>
                {uploadedImage ? (
                  <div>
                    <img 
                      src={uploadedImage.preview} 
                      alt="preview" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: 200, 
                        borderRadius: 4,
                        marginBottom: 12
                      }} 
                    />
                    <div style={{ fontSize: 12, color: '#666' }}>
                      {uploadedImage.name}
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#888', fontSize: 12 }}>
                    <div style={{ marginBottom: 8 }}>📸 No image selected</div>
                  </div>
                )}
                
                <Upload
                  beforeUpload={handleImageUpload}
                  accept="image/*"
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />} style={{ marginTop: 12 }}>
                    Upload Store Image
                  </Button>
                </Upload>
              </div>
            </Form.Item>
          </Card>
        )}

        {/* Step 2 - Location */}
        {currentStep === 1 && (
          <Card title="Store Location" style={{ marginBottom: 24 }}>
            <Form.Item 
              name="address" 
              label="Full Address" 
              rules={[{ required: true, message: 'Please enter address' }]}
            >
              <Input.TextArea 
                placeholder="Enter complete street address" 
                rows={4}
                size="large"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item 
                  name="state" 
                  label="State" 
                  rules={[{ required: true }]}
                >
                  <Input placeholder="e.g. Delhi" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item 
                  name="pincode" 
                  label="Postal Code" 
                  rules={[{ required: true }]}
                >
                  <Input placeholder="e.g. 110001" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item 
              name="landmark" 
              label="Nearby Landmark (Optional)"
            >
              <Input placeholder="e.g. Near Metro Station" size="large" />
            </Form.Item>
          </Card>
        )}

        {/* Step 3 - Contact */}
        {currentStep === 2 && (
          <Card title="Contact Information" style={{ marginBottom: 24 }}>
            <Form.Item 
              name="phone" 
              label="Phone Number" 
              rules={[{ required: true, message: 'Please enter phone number' }]}
            >
              <Input placeholder="+91-9876543210" size="large" />
            </Form.Item>

            <Form.Item 
              name="email" 
              label="Email (Optional)" 
              rules={[{ type: 'email' }]}
            >
              <Input placeholder="store@example.com" size="large" />
            </Form.Item>

            <Form.Item 
              name="manager" 
              label="Store Manager Name" 
              rules={[{ required: true, message: 'Please enter manager name' }]}
            >
              <Input placeholder="e.g. Rajesh Kumar" size="large" />
            </Form.Item>

            <Form.Item 
              name="managerPhone" 
              label="Manager Phone" 
              rules={[{ required: true }]}
            >
              <Input placeholder="Manager contact number" size="large" />
            </Form.Item>
          </Card>
        )}

        {/* Step 4 - Hours */}
        {currentStep === 3 && (
          <Card title="Operating Hours" style={{ marginBottom: 24 }}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item 
                  name="openTime" 
                  label="Opening Time" 
                  rules={[{ required: true, message: 'Please enter opening time' }]}
                >
                  <Input placeholder="e.g. 09:00 AM" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item 
                  name="closeTime" 
                  label="Closing Time" 
                  rules={[{ required: true, message: 'Please enter closing time' }]}
                >
                  <Input placeholder="e.g. 10:00 PM" size="large" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item 
              name="status" 
              label="Status" 
              rules={[{ required: true }]}
            >
              <Select placeholder="Select status" size="large">
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>

            <div style={{ 
              background: '#f0f8ff', 
              padding: 12, 
              borderRadius: 6, 
              marginBottom: 16,
              fontSize: 12,
              color: '#666'
            }}>
              ✓ Review all details before submitting
            </div>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
          <Button 
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 0}
            size="large"
          >
            Previous
          </Button>

          {currentStep < 3 ? (
            <Button 
              type="primary" 
              size="large"
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Next
            </Button>
          ) : (
            <Button 
              type="primary" 
              size="large"
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
            >
              Create Store
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}
