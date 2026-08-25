import { Request, Response } from 'express';
import {
  getAllCustomers,
  registerOrUpdateCustomer,
  findCustomerById,
  deleteCustomer,
  updateCustomer,
  verifyCustomerCredentials,
} from '../services/customerService.js';

export const listCustomers = async (_req: Request, res: Response) => {
  res.json(getAllCustomers());
};

export const loginCustomer = async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    res.status(400).json({ message: 'Email/username and password are required' });
    return;
  }
  const customer = verifyCustomerCredentials(String(email), String(password));
  if (!customer) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  res.json({
    success: true,
    message: 'Login successful',
    customer,
  });
};

export const registerCustomer = async (req: Request, res: Response) => {
  const { name, email, password, phone, avatarUrl } = req.body ?? {};
  if (!email || !name) {
    res.status(400).json({ message: 'Name and email are required' });
    return;
  }

  try {
    const customer = registerOrUpdateCustomer({
      name: String(name),
      email: String(email),
      password: password ? String(password) : undefined,
      phone: phone ? String(phone) : undefined,
      avatarUrl: avatarUrl ? String(avatarUrl) : undefined,
    });
    res.status(201).json({
      success: true,
      message: 'Customer account registered successfully',
      customer,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to register customer' });
  }
};

export const getCustomer = async (req: Request, res: Response) => {
  const customer = findCustomerById(String(req.params.id));
  if (!customer) {
    res.status(404).json({ message: 'Customer not found' });
    return;
  }
  res.json(customer);
};

export const updateCustomerById = async (req: Request, res: Response) => {
  const updated = updateCustomer(String(req.params.id), req.body ?? {});
  if (!updated) {
    res.status(404).json({ message: 'Customer not found' });
    return;
  }
  res.json(updated);
};

export const deleteCustomerById = async (req: Request, res: Response) => {
  const deleted = deleteCustomer(String(req.params.id));
  if (!deleted) {
    res.status(404).json({ message: 'Customer not found' });
    return;
  }
  res.json({ success: true, message: 'Customer deleted successfully' });
};
