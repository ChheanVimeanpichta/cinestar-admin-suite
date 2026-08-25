import { Router } from 'express';
import {
  listCustomers,
  registerCustomer,
  loginCustomer,
  getCustomer,
  updateCustomerById,
  deleteCustomerById,
} from '../controllers/customerController.js';

const router = Router();

// Public auth endpoints for customer accounts (used by movie-ticket-booking)
router.post('/login', loginCustomer);
router.post('/register', registerCustomer);
router.post('/', registerCustomer);

// Read, update, delete
router.get('/', listCustomers);
router.get('/:id', getCustomer);
router.put('/:id', updateCustomerById);
router.delete('/:id', deleteCustomerById);

export default router;
