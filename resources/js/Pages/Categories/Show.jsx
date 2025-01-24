import React from 'react';
import { Head, Link } from '@inertiajs/inertia-react';

export default function Show({ category }) {
    return (
        <div>
            <Head title={category.name} />
            <h1>{category.name}</h1>
            <Link href={route('categories.index')}>Back</Link>
        </div>
    );
}