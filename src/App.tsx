// src/App.tsx
import { useEffect, useState } from 'react'
import './App.css'

// ========== 类型定义 ==========

// Todo 类型   ts特有的语法  定规则
interface Todo {
  id: number
  text: string
  completed: boolean
  
}

// API 文章类型
interface Post {
  id: number
  title: string
  body: string
}

// ========== 主应用组件 ==========

export default function App() {
  // ========== Todo 相关状态 库存记录==========
  //const [状态变量, 设置状态的方法] = useState<类型>(初始值)
  const [todos, setTodos] = useState<Todo[]>([])//存储待办事项列表
  const [inputValue, setInputValue] = useState<string>('')//存储输入框的当前值

  // ========== API 相关状态 ==========
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // ========== Todo 功能：添加 Todo ==========
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleAddTodo = () => {
    if (inputValue.trim() === '') return//防止添加空的待办事项
    const newTodo: Todo = {
      id: Date.now(),//使用时间戳作为唯一ID
      text: inputValue,
      completed: false,
    }
    setTodos([...todos, newTodo])//添加新的待办事项到列表中
    setInputValue('')//清空输入框
  }

  // ========== Todo 功能：切换完成状态 ==========
  const toggleComplete = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  // ========== Todo 功能：删除 Todo 保存编辑后的内容==========
  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))//删除指定ID的待办事项
  }

  // ========== API 功能：获取文章列表 ==========
  useEffect(() => {
    const fetchPosts = async () => {
        //await new Promise(resolve => setTimeout(resolve, 3000)); // 模拟网络延迟
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts')
        if (!response.ok) throw new Error(`HTTP 错误：${response.status}`)
        const data: Post[] = await response.json()
        setPosts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // ========== 渲染部分 react的jsx语法 ==========
  return (
    <div className="app">
      <h1>🚀 React 综合小项目：Todo + API 调用</h1>

      <div className="container">
        {/* ===== 左侧：Todo 功能 ===== */}
        <div className="left-panel">
          <h2>📝 我的 Todo 列表</h2>
          <div className="input-section">
            <input
              type="text"
              placeholder="输入新的待办事项..."
              value={inputValue}
              onChange={handleInputChange}
            />
            <button onClick={handleAddTodo}>添加</button>
          </div>
          <ul className="todo-list">
            {todos.map(todo => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                />
                <span>{todo.text}</span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{ marginLeft: '8px', color: 'red' }}
                >
                  删除
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* ===== 右侧：API 文章列表 ===== */}
        <div className="right-panel">
          <h2>📰 API 文章列表</h2>
          {loading && <p className="loading">⏳ 加载中...</p>}
          {error && <p className="error">❌ 错误：{error}</p>}
          {!loading && !error && (
            <ul className="post-list">
              {posts.slice(0, 8).map(post => (
                <li key={post.id} className="post-item">
                  <h3>{post.title}</h3>
                  <p>{post.body.substring(0, 100)}...</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}