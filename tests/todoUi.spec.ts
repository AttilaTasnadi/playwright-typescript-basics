import { expect, test } from '../fixtures';
import { RESULT_MARKER, STEP_MARKER } from '../helpers/markers';
import { TodoFilter, TodoPage } from '../pages/todo.page';

test('can add a todo', async ({ open, pageHelper, logger }) => {
  const pageHeaderText = 'todos';
  const titleText = 'TodoMVC';
  const attributeName = 'placeholder';
  const placeholderText = 'What needs to be done?';
  const tasks = ['Task1', 'Task2', 'Task3'];

  logger.info(STEP_MARKER, '#01 - Navigate to the ToDo page.');
  const todoPage = await open(TodoPage);
  logger.info(RESULT_MARKER, '#01 - Navigation to the ToDo page is successful');
  await pageHelper.expectTitleContains(titleText);
  await expect(todoPage.pageHeader).toHaveText(pageHeaderText);
  await expect(todoPage.todoInput).toHaveAttribute(attributeName, placeholderText);
  await expect(todoPage.clearCompletedButton).toBeHidden();

  logger.info(STEP_MARKER, '#02 - Add at least three tasks to the todo list.');
  for (const task of tasks) {
    await todoPage.addTodo(task);
  }
  logger.info(RESULT_MARKER, '#02 - The added tasks are appeared on the page.');
  await expect(todoPage.todoList).toHaveCount(tasks.length);
  await todoPage.expectItemsLeft(tasks.length);
  await todoPage.expectTodos(tasks);

  logger.info(STEP_MARKER, '#03 - Select a task and mark it as completed.');
  await todoPage.completeTask(tasks[0], true);
  logger.info(RESULT_MARKER, '#03 - The selected task is marked as completed');
  await todoPage.expectItemsLeft(tasks.length - 1);
  await expect(todoPage.clearCompletedButton).toBeVisible();
  await todoPage.expectTodoCrossedOut(tasks[0], true);

  logger.info(STEP_MARKER, '#04 - Check if the correct tasks are on the Active tab.');
  await todoPage.selectFilter(TodoFilter.Active);
  logger.info(RESULT_MARKER, '#04 - The correct tasks appeared.');
  await todoPage.expectTodos(tasks.slice(1));
  await todoPage.expectItemsLeft(tasks.length - 1);

  logger.info(STEP_MARKER, '#05 - Check if the correct tasks are on the Completed tab.');
  await todoPage.selectFilter(TodoFilter.Completed);
  logger.info(RESULT_MARKER, '#05 - The correct tasks appeared.');
  await todoPage.expectTodos([tasks[0]]);
  await todoPage.expectItemsLeft(tasks.length - 1);

  logger.info(STEP_MARKER, '#06 - Navigate back to the All tab and use the Clear Completed button.');
  await todoPage.selectFilter(TodoFilter.All);
  await todoPage.clickOnClearCompletedButton();
  logger.info(RESULT_MARKER, '#06 - Clear Completed works as expected.');
  await todoPage.expectItemsLeft(tasks.length - 1);
  await todoPage.expectTodos(tasks.slice(1));
});