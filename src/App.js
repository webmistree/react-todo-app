import React, { useState, useEffect } from 'react';
import './App.css';

const BASE_URL = "http://localhost:9101";
const ALL_TODOS_URI = "/"

function App() {
  const appName = "Todo builder";
  return (
    <div className="App">
      <header className="App-header">
        <h1>{appName}</h1>
      </header>
      <TodoList />
    </div>
  );
}
function TodoList() {

  const [state, setState] = useState({
    todos: [],
    selected: {},
    mode: 'view',
    inputTodoName: ''
  })

  useEffect(() => {
    const fetchTodos = async () => {
      const res = await fetch(BASE_URL + ALL_TODOS_URI,
        {
          method: 'GET',
          mode: 'cors',
          Accept: 'application/json'
        }
      );
      const json = await res.json();
      setState(oldState => ({ ...oldState, todos: json }));
    }
    fetchTodos()
  }, [])

  const shouldDisable = (buttonKey) => {
    return state.mode !== 'view' && state.mode !== buttonKey
  }

  const nextSequence = () => {
    return (state.todos.length + 1);
  }

  const updateSelected = (selected) => {
    setState(oldState => {
      return ({
        ...oldState,
        selected,
      })
    })
  }

  const updateMode = (mode) => {
    setState(oldState => {
      return ({
        ...oldState,
        mode
      })
    })
  }

  const addTodo = (name) => {
    const code = nextSequence();
    const todoToBeAdded = { code, name };
    setState(oldState => {
      return ({
        ...oldState,
        todos: [...oldState.todos, {
          ...todoToBeAdded
        }]
      })
    })
    return todoToBeAdded;
  }

  const updateTodo = () => {
    const code = state.selected.code;
    const name = state.selected.name;
    const todoToBeUpdated = { code, name };
    setState(oldState => {
      oldState.todos.forEach((item) => {
        item.code === code && (item.name = name)
      })
      return ({
        ...oldState,
        todos: [...oldState.todos]
      })
    })
    return todoToBeUpdated;
  }

  const deleteTodo = () => {
    const code = state.selected.code;
    const name = state.selected.name;
    const deletedTodo = { code, name };
    setState(oldState => {
      const remainingTodos = oldState.todos.filter(item => item.code !== code)
      return ({
        ...oldState,
        todos: [...remainingTodos]
      })
    })
    return deletedTodo;
  }

  const handleClick = todo => (e) => {
    if (state.mode === 'view') updateSelected(todo);
  }

  const add = () => {
    if (state.mode !== 'add') {
      clearSelection();
      updateMode('add');

      return;
    }
    const addedTodo = addTodo(state.selected.name);
    viewMode(addedTodo);
  }

  const edit = () => {
    if (!state.selected.name) return;
    if (state.mode !== 'edit') {
      updateMode('edit');
      return;
    }
    const updatedTodo = updateTodo();
    viewMode(updatedTodo);
  }

  const deleteIt = () => {
    if (!state.selected.name) return;
    if (state.mode !== 'delete') {
      updateMode('delete');
      return;
    }
    deleteTodo();
    viewMode();
  }

  const clearSelection = () => {
    viewMode();
  }

  const viewMode = (selected = {}) => {
    updateSelected(selected);
    updateMode('view');
  }

  return (
    <>
      <div className='todo-wrapper'>
        <form onSubmit={(e) => { e.preventDefault() }}>
          <button onClick={clearSelection} className='secondary button right'> Cancel </button>
          {state.mode === 'add' &&
            <div>
              <input
                autoFocus
                className='todo-input'
                type='text'
                value={state.selected.name}
                onChange={e => {
                  updateSelected({ name: e.target.value });
                }} />
            </div>}
          {state.mode === 'edit' && <div>
            <span>Code : {state.selected.code}</span>
            <input
              autoFocus
              className='todo-input'
              type='text'
              value={state.selected.name}
              onChange={e => {
                updateSelected({
                  code: state.selected.code,
                  name: e.target.value
                });
              }}
            />
          </div>}
          <button
            onClick={add}
            className='primary button'
            disabled={shouldDisable('add')}
          > Add </button>
          <button
            onClick={edit}
            className='primary button'
            disabled={shouldDisable('edit')}
          >
            {state.mode === 'edit' ? 'Update' : 'Edit'}
          </button>
          <button
            onClick={deleteIt}
            className='primary button'
            disabled={shouldDisable('delete')}
          >
            {state.mode === 'delete' ? 'Delete selected' : 'Delete'}
          </button>
        </form>
        <table className='todo-table'>
          <thead><tr>
            <th className='todo-table__sno'>Sno.</th>
            <th className='todo-table__name'>Name</th>
          </tr>
          </thead>
          <tbody>
            {state.todos.map((todo, index) => (
              <tr
                onClick={handleClick(todo)}
                className={state.selected.code === todo.code ? 'selected' : undefined}
                key={todo.code}
              >
                <td className='todo-table__sno'>{index + 1}</td>
                <td className='todo-table__name'>{todo.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
export default App;
