import React from "react";
import { Head, Link, useForm } from "@inertiajs/inertia-react";

export default function Edit({ subcategory, categories }) {
    const { data, setData, put, processing, errors } = useForm({
        category_id: subcategory.category_id,
        name: subcategory.name,
        link: subcategory.link,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("subcategories.update", subcategory.id));
    };

    return (
        <div>
            <Head title={`Edit ${subcategory.name}`} />
            <h1>Edit Subcategory</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="category_id" className="form-label">
                        Category
                    </label>
                    <select
                        id="category_id"
                        value={data.category_id}
                        onChange={(e) => setData("category_id", e.target.value)}
                        className={`form-control ${
                            errors.category_id ? "is-invalid" : ""
                        }`}
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    {errors.category_id && (
                        <div className="invalid-feedback">
                            {errors.category_id}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className={`form-control ${
                            errors.name ? "is-invalid" : ""
                        }`}
                    />
                    {errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="link" className="form-label">
                        Link
                    </label>
                    <input
                        type="url"
                        id="link"
                        value={data.link}
                        onChange={(e) => setData("link", e.target.value)}
                        className={`form-control ${
                            errors.link ? "is-invalid" : ""
                        }`}
                    />
                    {errors.link && (
                        <div className="invalid-feedback">{errors.link}</div>
                    )}
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={processing}
                >
                    {processing ? "Updating..." : "Update"}
                </button>
                <Link
                    href={route("subcategories.index")}
                    className="btn btn-secondary ms-2"
                >
                    Cancel
                </Link>
            </form>
        </div>
    );
}
