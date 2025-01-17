const Router = require('express').Router;
const router = new Router();
const userController = require('../controllers/user-controller');
const fileController = require('../controllers/file-controller');
const eventController = require('../controllers/event-controller');
const clientController = require('../controllers/client-controller');
const {body} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const upload = require('../utils/multer');

router.post('/registration',
    authMiddleware,
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);

router.post('/upload', authMiddleware, upload.array('files', 10), fileController.uploadMultiple);
router.get('/download/:category/:directory/:filename', fileController.sendFile);
router.get('/get-files', fileController.getFiles);

router.post('/createEvent', authMiddleware, upload.array('files', 10), eventController.createEvent);
router.put('/updateEvent/:eventId', authMiddleware, upload.array('files', 10), eventController.updateEvent);
router.get('/getEvent/:eventId', eventController.getEventById);
router.get('/getEvents', eventController.getAllEvents);
router.delete('/deleteEvent/:eventId', authMiddleware, eventController.deleteEvent);

router.post('/register-client', clientController.registerClient);
router.get('/event/:event_id/clients', authMiddleware, clientController.getClientsByEvent);


module.exports = router;