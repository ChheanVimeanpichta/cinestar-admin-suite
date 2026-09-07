import { Router } from 'express';
import {
  listCustomers,
  registerCustomer,
  loginCustomer,
  logoutCustomer,
  getCustomer,
  getCustomerStatus,
  updateCustomerById,
  deleteCustomerById,
  reactivateCustomerById,
} from '../controllers/customerController.js';

const router = Router();

// Public auth endpoints for customer accounts (used by movie-ticket-booking)
router.post('/login', loginCustomer);
router.post('/logout', logoutCustomer);
router.post('/register', registerCustomer);
router.post('/', registerCustomer);
router.get('/status/:email', getCustomerStatus);

// Read, update, delete, reactivate
router.get('/', listCustomers);
router.get('/:id', getCustomer);
router.put('/:id', updateCustomerById);
router.patch('/:id/reactivate', reactivateCustomerById);
router.delete('/:id', deleteCustomerById);

export default router;
