// import { Card, Form, Input, Button, message } from "antd";

// export default function CustomerProfile() {
//   const [form] = Form.useForm();

//   function handleSave(values) {
//     message.success('Profile updated successfully!');
//     console.log(values);
//   }

//   return (
//     <div>
//       <h2 style={{ marginBottom: 24 }}>My Profile</h2>
//       <Card style={{ maxWidth: 600 }}>
//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={handleSave}
//           initialValues={{
//             name: 'Alice Kumar',
//             email: 'customer@test.com',
//             phone: '+91-9876543210',
//             address: '123 Street, City, State - 400001'
//           }}
//         >
//           <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
//             <Input disabled />
//           </Form.Item>
//           <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item name="address" label="Address">
//             <Input.TextArea rows={3} />
//           </Form.Item>
//           <Form.Item>
//             <Button type="primary" htmlType="submit" size="large">
//               Update Profile
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>
//     </div>
//   );
// }

// src/pages/customer/Profile.jsx
import React, { useEffect, useState } from "react";
import { getProfile } from '../../app/api';

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:4000/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProfile(data.profile));
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h2>{profile.name}</h2>
      <p>Email: {profile.email}</p>
      <p>Mobile: {profile.phone || "-"}</p>
      {/* Add more fields as per your backend */}
    </div>
  );
}

