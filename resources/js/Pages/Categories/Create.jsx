import React from "react";
import { Head, Link, useForm } from "@inertiajs/inertia-react";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("categories.store"));
    };

    return (
        <div>
            <Head title="Create Category" />
            <h1>Create New Category</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                    />
                    {errors.name && <span>{errors.name}</span>}
                </div>
                <button type="submit" disabled={processing}>
                    Create
                </button>
            </form>
            <Link href={route("categories.index")}>Back</Link>
        </div>
    );
}
