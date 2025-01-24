import React from "react";
import { Head, Link, useForm } from "@inertiajs/inertia-react";

export default function Edit({ course, subcategories, schools }) {
    const { data, setData, put, processing, errors } = useForm({
        subcategory_id: course.subcategory_id,
        school_id: course.school_id,
        name: course.name,
        description: course.description,
        price: course.price,
        link: course.link,
        link_more: course.link_more,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("courses.update", course.id));
    };

    return (
        <div>
            <Head title={`Edit ${course.name}`} />
            <h1>Edit Course</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="subcategory_id" className="form-label">
                        Subcategory
                    </label>
                    <select
                        id="subcategory_id"
                        value={data.subcategory_id}
                        onChange={(e) =>
                            setData("subcategory_id", e.target.value)
                        }
                        className={`form-control ${
                            errors.subcategory_id ? "is-invalid" : ""
                        }`}
                    >
                        <option value="">Select Subcategory</option>
                        {subcategories.map((subcategory) => (
                            <option key={subcategory.id} value={subcategory.id}>
                                {subcategory.name}
                            </option>
                        ))}
                    </select>
                    {errors.subcategory_id && (
                        <div className="invalid-feedback">
                            {errors.subcategory_id}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="school_id" className="form-label">
                        School
                    </label>
                    <select
                        id="school_id"
                        value={data.school_id}
                        onChange={(e) => setData("school_id", e.target.value)}
                        className={`form-control ${
                            errors.school_id ? "is-invalid" : ""
                        }`}
                    >
                        <option value="">Select School</option>
                        {schools.map((school) => (
                            <option key={school.id} value={school.id}>
                                {school.name}
                            </option>
                        ))}
                    </select>
                    {errors.school_id && (
                        <div className="invalid-feedback">
                            {errors.school_id}
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
                    <label htmlFor="description" className="form-label">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        className={`form-control ${
                            errors.description ? "is-invalid" : ""
                        }`}
                    />
                    {errors.description && (
                        <div className="invalid-feedback">
                            {errors.description}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className="form-label">
                        Price
                    </label>
                    <input
                        type="number"
                        id="price"
                        value={data.price}
                        onChange={(e) => setData("price", e.target.value)}
                        className={`form-control ${
                            errors.price ? "is-invalid" : ""
                        }`}
                    />
                    {errors.price && (
                        <div className="invalid-feedback">{errors.price}</div>
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
                <div className="mb-3">
                    <label htmlFor="link_more" className="form-label">
                        More Info Link
                    </label>
                    <input
                        type="url"
                        id="link_more"
                        value={data.link_more}
                        onChange={(e) => setData("link_more", e.target.value)}
                        className={`form-control ${
                            errors.link_more ? "is-invalid" : ""
                        }`}
                    />
                    {errors.link_more && (
                        <div className="invalid-feedback">
                            {errors.link_more}
                        </div>
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
                    href={route("courses.index")}
                    className="btn btn-secondary ms-2"
                >
                    Cancel
                </Link>
            </form>
        </div>
    );
}
