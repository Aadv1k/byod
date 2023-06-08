import { redirect } from 'next/navigation';

import dork from "@byod/dork";

export default function ({
    params,
    searchParams
})  {

    if (!searchParams["q"]) {
        redirect("/");
        return;
    }


    return (
        <code>
            {JSON.stringify(dork(searchParams["q"]), null, 2)}
        </code>
    )
}

