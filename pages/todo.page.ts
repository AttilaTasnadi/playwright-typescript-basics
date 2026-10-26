import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base.page';

export enum TodoFilter {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

const FILTER_HASH: Record<TodoFilter, string> = {
  [TodoFilter.All]: '#/',
  [TodoFilter.Active]: '#/active',
  [TodoFilter.Completed]: '#/completed',
};

export class TodoPage extends BasePage {
    readonly path = '/todomvc/#/';

    readonly pageHeader: Locator;
    readonly todoInput: Locator;
    readonly todoList: Locator;
    readonly numberOfItems: Locator;
    readonly clearCompletedButton: Locator;
    readonly filters: Locator;
    readonly todoTitles: Locator;

    constructor(page: Page) {
        super(page);
        this.pageHeader = page.locator('.header').getByRole('heading', { level: 1 });
        this.todoInput = page.locator('.header').getByPlaceholder('What needs to be done?');
        this.todoList = page.locator('ul.todo-list').getByTestId('todo-item');
        this.numberOfItems = page.getByTestId('todo-count');
        this.clearCompletedButton = page.locator('button.clear-completed');
        this.filters = page.locator('ul.filters');
        this.todoTitles = page.locator('ul.todo-list').getByTestId('todo-title');
    }

    async addTodo(text: string) {
        await this.todoInput.fill(text);
        await this.todoInput.press('Enter');
    }

    async expectItemsLeft(count: number) {
        const label = count === 1 ? 'item' : 'items';
        await expect(this.numberOfItems).toHaveText(`${count} ${label} left`);
    }

    async completeTask(name: string, checked: boolean) {
        const item = this.todoItem(name);
        await item.getByRole('checkbox', { name: 'Toggle Todo' }).setChecked(checked);
    }

    async expectTodoCrossedOut(name: string, crossedOut: boolean) {
        const label = this.todoItem(name).getByTestId('todo-title');
        await expect(label).toHaveCSS('text-decoration-line', crossedOut ? 'line-through' : 'none');
    }

    private todoItem(name: string) {
        return this.todoList.filter({ has: this.page.getByText(name, { exact: true }) });
    }

    async selectFilter(filter: TodoFilter) {
        await this.filters.getByRole('link', { name: filter, exact: true }).click();
        const hash = FILTER_HASH[filter];
        await expect(this.page).toHaveURL(
            new RegExp(`${hash.replace('/', '\\/')}$`),
        );
    }

    async expectTodos(titles: string[]) {
       await expect(this.todoTitles).toHaveText(titles);
    }

    async clickOnClearCompletedButton() {
        await this.clearCompletedButton.click();
    }

    
}