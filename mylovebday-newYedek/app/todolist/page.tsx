"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Circle, Trash2, Plus } from "lucide-react";
import Link from "next/link";

interface Todo {
    id: string;
    text: string;
    completed: boolean;
    createdAt: string; // ISO string
    completedAt?: string; // ISO string | undefined
}

export default function TodoListPage() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [input, setInput] = useState("");

    // localStorage'dan yükle
    useEffect(() => {
        const stored = localStorage.getItem("todos");
        if (stored) setTodos(JSON.parse(stored));
    }, []);

    // localStorage'a kaydet
    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    const addTodo = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const text = input.trim();
        if (!text) return;
        setTodos([
            ...todos,
            {
                id: Date.now().toString(),
                text,
                completed: false,
                createdAt: new Date().toISOString(),
                completedAt: undefined,
            },
        ]);
        setInput("");
    };

    const toggleTodo = (id: string) => {
        setTodos((prev) =>
            prev.map((todo) => {
                if (todo.id !== id) return todo;
                if (!todo.completed) {
                    // Tamamlanıyorsa bitiş zamanını ekle
                    return { ...todo, completed: true, completedAt: new Date().toISOString() };
                } else {
                    // Tekrar tamamlanmadı olarak işaretlenirse bitiş zamanını sil
                    return { ...todo, completed: false, completedAt: undefined };
                }
            })
        );
    };

    const deleteTodo = (id: string) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    };

    return (
        <div className="max-w-xl mx-auto py-10 px-4">
            <div className="flex justify-center mb-6">
                <Link href="/" className="inline-flex items-center gap-2 bg-white/80 hover:bg-purple-100 text-purple-700 font-semibold px-6 py-2 rounded-full shadow transition-colors border border-purple-200 text-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Ana Menü
                </Link>
            </div>
            <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center flex items-center justify-center gap-2">
                <Plus className="w-8 h-8 text-purple-400" /> Todolist
            </h1>
            <form onSubmit={addTodo} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Yeni görev..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 shadow focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all bg-white"
                />
                <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-pink-400 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-purple-600 hover:to-pink-500 transition-all"
                >
                    Ekle
                </button>
            </form>
            <ul className="space-y-3">
                {todos.length === 0 && (
                    <li className="text-gray-400 text-center">Henüz görev yok.</li>
                )}
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        className={`flex items-center justify-between p-4 rounded-xl shadow bg-gradient-to-r from-pink-50 via-purple-50 to-pink-100 border border-purple-100 ${todo.completed ? "opacity-60" : ""
                            }`}
                    >
                        <button
                            onClick={() => toggleTodo(todo.id)}
                            className="mr-3 focus:outline-none"
                            aria-label={todo.completed ? "Tamamlandı" : "Tamamla"}
                        >
                            {todo.completed ? (
                                <CheckCircle className="w-6 h-6 text-purple-500" />
                            ) : (
                                <Circle className="w-6 h-6 text-gray-400" />
                            )}
                        </button>
                        <div className="flex-1">
                            <span
                                className={`block text-lg ${todo.completed ? "line-through text-gray-400" : "text-gray-700"
                                    }`}
                            >
                                {todo.text}
                            </span>
                            <span className="block text-xs text-gray-400 mt-1">
                                Başlangıç: {todo.createdAt ? new Date(todo.createdAt).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }) : ''}
                            </span>
                            {todo.completedAt && (
                                <span className="block text-xs text-green-500 mt-1">
                                    Bitiş: {new Date(todo.completedAt).toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' })}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => deleteTodo(todo.id)}
                            className="ml-3 text-red-400 hover:text-red-600 focus:outline-none"
                            aria-label="Sil"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
} 