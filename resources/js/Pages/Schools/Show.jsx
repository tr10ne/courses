import React from "react";
import { Head, Link } from "@inertiajs/inertia-react";

export default function Show({ school }) {
    return (
        <div>
            <Head title={school.name} />
            <h1>{school.name}</h1>
            <p>{school.description}</p>
            <p>
                Link:{" "}
                <a href={school.link} target="_blank" rel="noopener noreferrer">
                    {school.link}
                </a>
            </p>
            <Link href={route("schools.index")} className="btn btn-secondary">
                Back to Schools
            </Link>
        </div>
    );
}
