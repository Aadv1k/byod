import { redirect } from 'next/navigation';

// import search from "@byod/crawler";


export default function ({
    params,
    searchParams
})  {


    if (!searchParams["q"]) {
        redirect("/");
        return;
    }

    return (
        <h1>
            test 123
        </h1>
    )
}

