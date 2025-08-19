const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const summarizeService = require('../services/summarizeService');

router.get('/todos', todoController.getTodos);
router.post('/todos', todoController.createTodo);
router.delete('/todos/:id', todoController.deleteTodo);
router.patch('/todos/:id/toggle', todoController.toggleTodo);
router.patch('/todos/:id', todoController.updateTodoText);
router.post('/summarize', summarizeService.summarizeTodos);

module.exports = router;
