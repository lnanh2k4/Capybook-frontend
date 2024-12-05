import React, { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Divider,
  Dropdown,
  Menu,
  Modal,
  Select,
} from "antd";
import {
  UserOutlined,
  ShoppingCartOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { viewCart, fetchPromotions, createPayment, handlePaymentReturn } from "../config"; // API functions
import { decodeJWT } from "../jwtConfig";
