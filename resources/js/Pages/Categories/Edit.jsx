import React from 'react';
import { Head, Link, useForm } from '@inertiajs/inertia-react';

export default function Edit({ category }) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('categories.update', category.id));
    };

    return (
        <div>
            <Head title="Edit Category" />
            <h1>Edit Category</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    {errors.name && <span>{errors.name}</span>}
                </div>
                <button type="submit" disabled={processing}>Update</button>
            </form>
            <Link href={route('categories.index')}>Back</Link>
        </div>
    );
}