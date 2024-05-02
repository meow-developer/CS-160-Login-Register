import { Router } from 'express';
import { validateLogin, validateRegister } from './middleware/validator/httpInputValidator.js'
import { handleExpressValidation } from './middleware/validator/expressValidatorHandler.js';
import captchaVerify from './middleware/captcha.js';
import * as controller from './controller/index.js';


const router = Router();

router.use(captchaVerify);

router.get('/login', validateLogin, controller.login);

router.post('/register', validateRegister);

router.put('/update');

router.use(handleExpressValidation);

export default router;