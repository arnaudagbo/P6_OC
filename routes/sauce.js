const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
// const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

router.post('/', sauceCtrl.createSauce);
router.put('/:id', sauceCtrl.modifySauce);
router.delete('/:id', sauceCtrl.deleteSauce);
router.get('/:id', sauceCtrl.getOneSauce );
router.get('/', sauceCtrl.getAllSauces);

module.exports = router;