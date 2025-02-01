import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

import {base_url} from "../utils/baseURL.js";

const { Title } = Typography;

const AuthPage = () => {
    const navigate = useNavigate();
    const [isSignup, setIsSignup] = useState(false);
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            if (isSignup) {
                // Sign Up API Call
                const response = await axios.post(`${base_url}/user/signup`, values);
                message.success(response.data.message);

            } else {
                // Login API Call
                const response = await axios.post(`${base_url}/user/login`, values);
                localStorage.setItem("token", response.data.token);
                message.success("Login successful!");
                navigate("/home")
            }
        } catch (error) {
            message.error(error.response?.data?.message || "Something went wrong!");
        }
        setLoading(false);
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }} className={"bg-amber-100"}>
            <Card style={{ width: 400, padding: 20, textAlign: "center" }}>
                <Title level={2}>{isSignup ? "Sign Up" : "Login"}</Title>
                <Form name="authForm" onFinish={onFinish} layout="vertical">
                    {isSignup && (
                        <>
                            <Form.Item name="first_name" rules={[{ required: true, message: "Please enter your first name" }]}>
                                <Input prefix={<UserOutlined />} placeholder="First Name" />
                            </Form.Item>
                            <Form.Item name="last_name" rules={[{ required: true, message: "Please enter your last name" }]}>
                                <Input prefix={<UserOutlined />} placeholder="Last Name" />
                            </Form.Item>
                        </>
                    )}
                    <Form.Item name="email" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}>
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: "Please enter your password" }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            {isSignup ? "Sign Up" : "Login"}
                        </Button>
                    </Form.Item>
                </Form>
                <Typography.Text>
                    {isSignup ? "Already have an account? " : "Don't have an account? "}
                    <Button type="link" onClick={() => setIsSignup(!isSignup)}>
                        {isSignup ? "Login" : "Sign Up"}
                    </Button>
                </Typography.Text>
            </Card>
        </div>
    );
};

export default AuthPage;
