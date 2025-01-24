import React from 'react';
import { Head, Link } from '@inertiajs/inertia-react';

export default function Index({ categories }) {
    return (
        <div>
            <Head title="Categories" />
            <h1>Categories</h1>
            <Link href={route('categories.create')} className="btn btn-success">Create New Category</Link>
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category => (
                        <tr key={category.id}>
                            <td>{category.id}</td>
                            <td>{category.name}</td>
                            <td>
                                <Link href={route('categories.show', category.id)} className="btn btn-info">Show</Link>
                                <Link href={route('categories.edit', category.id)} className="btn btn-primary">Edit</Link>
                                <Link
                                    method="delete"
                                    href={route('categories.destroy', category.id)}
                                    className="btn btn-danger"
                                    as="button"
                                >
                                    Delete
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}