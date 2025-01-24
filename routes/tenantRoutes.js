const express = require('express')
const tenantController = require('../controllers/tenantController')
const router = express.Router();
router.get('/', tenantController.getTenants);
router.get('/:id', tenantController.getById);
router.post('/', tenantController.save);
router.patch('/:id', tenantController.updateById);
router.delete('/:id', tenantController.deleteById);
router.delete('/:adminToken', tenantController.deleteAll);
module.exports = router