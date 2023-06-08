import { redirect } from 'next/navigation';

export default async function ({
    params,
    searchParams
})  {

    if (!searchParams["q"]) {
        redirect("/");
        return;
    }


    const data = await search(searchParams["q"]);

    return (
        <ul className="flex flex-col" onClick={(e) => {
            console.log("clicked");
        }}>
            {data.map((e, i) => {
                return (
                    <li key={i}>
                        {e.title}
                    </li>
                )
            })
            }
        </ul>
    )
}
