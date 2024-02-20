import { ITodo } from '../entities/ITodo';
import { IUser } from '../entities/IUser';
import { createStore } from '../store/createStore';

interface IGlobalStore {
  user: IUser | null;
  todos: ITodo[];
  login(): void;
  logout(): void;
  addTodo(title: string, author?: string): void;
  toggleTodoDone(todoId: number): void;
  removeTodo(todoId: number): void;
}

export const useGlobalStore = createStore<IGlobalStore>(
  (setState, getState) => ({
    user: null,
    todos: [],
    login: () =>
      setState({
        user: {
          name: 'Gabriel Ferreira',
          email: 'gabriel.ferreira.itba@gmail.com',
        },
      }),
    logout: () => setState({ user: null }),
    addTodo: (title: string) => {
      const newTodo: ITodo = {
        id: Date.now(),
        title,
        author: getState().user?.name ?? 'Convidado',
        done: false,
      };

      setState((prevState) => ({
        todos: prevState.todos.concat(newTodo),
      }));
    },
    toggleTodoDone: (todoId: number) => {
      setState((prevState) => ({
        todos: prevState.todos.map((todo) =>
          todo.id === todoId ? { ...todo, done: !todo.done } : todo,
        ),
      }));
    },
    removeTodo: (todoId: number) => {
      setState((prevState) => ({
        todos: prevState.todos.filter((todo) => todo.id !== todoId),
      }));
    },
  }),
);
