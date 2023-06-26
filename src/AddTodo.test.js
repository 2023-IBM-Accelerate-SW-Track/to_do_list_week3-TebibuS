import { render, screen, fireEvent } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('test that App component doesn\'t render duplicate tasks', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', { name: /Add/i });
  const dueDate = "05/30/2023";

  // Add a task
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);

  // Add the same task again
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);

  const tasks = screen.getAllByText(/History Test/i);
  expect(tasks).toHaveLength(1); // Expect only one task with the same name
});

test('test that App component doesn\'t add a task without a task name', () => {
  render(<App />);
  const addButton = screen.getByRole('button', { name: /Add/i });
  fireEvent.click(addButton);

  const tasks = screen.queryByText(/You have no todo's left/i);
  expect(tasks).toBeInTheDocument(); // Expect the error message to be displayed
});

test('test that App component doesn\'t add a task without a due date', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const addButton = screen.getByRole('button', { name: /Add/i });

  // Add a task without a due date
  fireEvent.change(inputTask, { target: { value: "New Task" } });
  fireEvent.click(addButton);

  const tasks = screen.queryByText(/New Task/i);
  expect(tasks).not.toBeInTheDocument(); // Expect the task not to be added
});

test('test that App component can be deleted through checkbox', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', { name: /Add/i });
  const dueDate = "05/30/2023";

  // Add a task
  fireEvent.change(inputTask, { target: { value: "Delete Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);

  // Delete the task
  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);

  const tasks = screen.queryByText(/Delete Test/i);
  expect(tasks).not.toBeInTheDocument(); // Expect the task to be removed
});

test('test that App component renders different colors for past due events', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', { name: /Add/i });

  const currentDate = new Date();
  const pastDueDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
  const futureDueDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);

  // Add a task with a past due date
  fireEvent.change(inputTask, { target: { value: "Past Due Task" } });
  fireEvent.change(inputDate, { target: { value: pastDueDate.toLocaleDateString() } });
  fireEvent.click(addButton);

  // Add a task with a future due date
  fireEvent.change(inputTask, { target: { value: "Future Due Task" } });
  fireEvent.change(inputDate, { target: { value: futureDueDate.toLocaleDateString() } });
  fireEvent.click(addButton);

  const pastDueTask = screen.getByTestId(/Past Due Task/i);
  const futureDueTask = screen.getByTestId(/Future Due Task/i);

  expect(pastDueTask).toBeInTheDocument();
  expect(pastDueTask).toHaveStyle('background: red');
  expect(futureDueTask).toBeInTheDocument();
  expect(futureDueTask).toHaveStyle('background: white');
});

