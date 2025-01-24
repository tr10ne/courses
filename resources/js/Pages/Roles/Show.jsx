import React from "react";
import { Head, Link } from "@inertiajs/inertia-react";

export default function Show({ role }) {
    return (
        <div>
            <Head title={role.role_name} />
            <h1>{role.role_name}</h1>
            <Link href={route("roles.index")} className="btn btn-secondary">
                Back to Roles
            </Link>
        </div>
    );
}
