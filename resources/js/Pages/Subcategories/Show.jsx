import React from "react";
import { Head, Link } from "@inertiajs/inertia-react";

export default function Show({ subcategory }) {
    return (
        <div>
            <Head title={subcategory.name} />
            <h1>{subcategory.name}</h1>
            <p>Category: {subcategory.category.name}</p>
            <p>
                Link:{" "}
                <a
                    href={subcategory.link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {subcategory.link}
                </a>
            </p>
            <Link
                href={route("subcategories.index")}
                className="btn btn-secondary"
            >
                Back to Subcategories
            </Link>
        </div>
    );
}
