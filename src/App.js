import { useEffect, useState } from 'react';
import axios from 'axios';
import { Title } from "./Components/Title/Title";
import { TodoInput } from "./Components/TodoInput/TodoInput";
import { TodoList } from "./Components/TodoList/TodoList";

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

function App() {
    const [todos, setTodos] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [filteredTodos, setFilteredTodos] = useState([]);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get(API_URL);
            setTodos(response.data.slice(0, 10)); // Limita el número de todos a 10 para simplicidad
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const addTodo = async (title) => {
        try {
            if (title.trim()) {
                const response = await axios.post(API_URL, {
                    title,
                    completed: false
                });
                setTodos([...todos, { ...response.data, id: todos.length + 1 }]); // Asignar un id local para evitar conflictos
            } else {
                console.error('Todo title cannot be empty');
            }
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const handleSetComplete = async (id) => {
        const todo = todos.find(todo => todo.id === id);
        if (todo) {
            try {
                const updatedTodo = { ...todo, completed: !todo.completed };
                const response = await axios.put(`${API_URL}/${id}`, updatedTodo);
                if (response.status === 200) {
                    const updatedList = todos.map(todo => {
                        if (todo.id === id) {
                            return { ...todo, completed: !todo.completed };
                        }
                        return todo;
                    });
                    setTodos(updatedList);
                }
            } catch (error) {
                console.error('Error updating todo:', error);
            }
        } else {
            console.error(`Todo with id ${id} not found`);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            if (response.status === 200) {
                const updatedList = todos.filter(todo => todo.id !== id);
                setTodos(updatedList);
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const handleClearComplete = () => {
        const updatedList = todos.filter(todo => !todo.completed);
        setTodos(updatedList);
    };

    const showAllTodos = () => {
        setActiveFilter('all');
    };

    const showActiveTodos = () => {
        setActiveFilter('active');
    };

    const showCompletedTodos = () => {
        setActiveFilter('completed');
    };

    useEffect(() => {
        if (activeFilter === 'all') {
            setFilteredTodos(todos);
        } else if (activeFilter === 'active') {
            const activeTodos = todos.filter(todo => !todo.completed);
            setFilteredTodos(activeTodos);
        } else if (activeFilter === 'completed') {
            const completedTodos = todos.filter(todo => todo.completed);
            setFilteredTodos(completedTodos);
        }
    }, [activeFilter, todos]);

    return (
        <div className='bg-gray-900 min-h-screen h-full font-inter text-gray-100 flex items-center justify-center py-20 px-5'>
            <div className='container flex-col max-w-xl'>
                <Title />
                <TodoInput addTodo={addTodo} />
                <TodoList 
                    todos={filteredTodos}
                    activeFilter={activeFilter}
                    handleSetComplete={handleSetComplete}
                    handleDelete={handleDelete}
                    showAllTodos={showAllTodos}
                    showActiveTodos={showActiveTodos}
                    showCompletedTodos={showCompletedTodos}
                    handleClearComplete={handleClearComplete}
                />
            </div>
        </div>
    );
}

export default App;

