import { useEffect, useState } from "react";

export type bookMarks = {
    title: string,
    logo: string,
    bookmarks: rootObj,
    bookmarksData: any[],
    expand?: boolean,
}

export type rootObj = {
    roots: {
        bookmark_bar: {
            children: bookmark_childrens[]
        },
        other: any,
        synced: any,
    }
}

export type bookmark_childrens = {
    date_added: string,
    date_last_used: string,
    guid: string,
    id: string,
    name: string,
    type: string,
    url: string,
    children: any[],
    expand?: boolean
}

export type bookMarkProps = {
    bookmarks: bookMarks[]
}

export default function BookMarks({ bookmarks }: bookMarkProps) {

    const [data, setBookMarks] = useState<bookMarks[]>([])

    useEffect(() => {
        setBookMarks(bookmarks.map(x => {
            x.expand = false
            return {
                ...x, bookmarksData: x.bookmarks.roots.bookmark_bar.children.filter(x => x.type === "folder").map(x => {
                    x.expand = false
                    return x;
                })
            };
        }));

        console.log("bookmarks => ", data);
    }, [bookmarks]);


    const onExpand = (Pindex: number, value: boolean) => {
        const updatedFields = data[Pindex];
        updatedFields.expand = value;
        setBookMarks([...data]);
    };

    const onChildrenExpand = (Pindex: number, Cindex: number, value: boolean) => {
        const updatedFields = data[Pindex].bookmarksData[Cindex];
        updatedFields.expand = value;
        setBookMarks([...data]);
    };

    const isEmpty = (data: any[]) => {
        return data.length === 0;
    }

    const onRun = (Pindex: number , index :number) => {
        console.log(data[Pindex].bookmarksData[index].children);
        
     }


    return (
        <>
            {
                data.length > 0 &&
                data.map(({ title, expand, logo, bookmarksData: childData }: bookMarks, Pindex: number) => (
                    <section className="border-y shadow-sm cursor-pointer" key={Pindex} onClick={() => onExpand(Pindex, !expand)}>
                        {/* Card Header */}
                        <div className="flex justify-between p-5">
                            <div className="flex gap-2 items-center">
                                <img className="max-w-10 h-5" src={logo} alt="" />
                                <h2 className="text-xl">{title}</h2>
                            </div>
                            <div className="flex justify-center items-center">
                                <svg
                                    className={`w-7 h-7 transform transition-transform ${expand ? "rotate-180" : "rotate-0"
                                        }`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Parent Expandable Content */}
                        <div id="parent" className={`transition-[max-height] duration-300 ease-in-out overflow-auto ${isEmpty(childData) && "h-96"} ${expand ? "max-h-100" : "max-h-0"
                            }`} onClick={(e) => e.stopPropagation()}
                        >
                            {!isEmpty(childData) ?
                                <div className="p-4 shadow-md min-h-40">
                                    {childData.map((data: bookmark_childrens, index: number) => (
                                        <div id="child-content " key={index}>
                                            <section className="border-y shadow-sm cursor-pointer" key={index} onClick={() => onChildrenExpand(Pindex, index, !data.expand)}>
                                                {/* Card Header */}
                                                <div className="flex justify-between p-5">
                                                    <div className="flex gap-2 items-center">
                                                        {/* <img className="max-w-10 h-5" src={logo} alt="" /> */}
                                                        <h2 className="text-xl">{data.name}</h2>
                                                    </div>
                                                    <div className="flex justify-center items-center">
                                                        <div className="primary-btn flex items-center text-white !p-[6px] rounded mr-2" onClick={(e) => { e.stopPropagation(), onRun(Pindex , index) }}>
                                                            <svg className="fill-white  " width="15" height="15" viewBox="0 0 16 16" fill="black">
                                                                <path d="M4 2L12 8L4 14V2Z" />
                                                            </svg>
                                                        </div>
                                                        <svg
                                                            className={`w-7 h-7 transform transition-transform ${data.expand ? "rotate-180" : "rotate-0"} `}
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>

                                            </section>
                                            <div id="child" className={`transition-[max-height] duration-300 ease-in-out overflow-hidden  ${data.expand ? "max-h-100" : "max-h-0"}`} onClick={(e) => e.stopPropagation()} >
                                                {
                                                    (data.children.length > 0) &&
                                                    data.children.map(({name}: bookmark_childrens, childrenIndex: number) => (
                                                        <label key={childrenIndex} className="w-fit text-sm p-2 m-4 block rounded-md bg-gray-400 shadow-sm">
                                                            {name}
                                                        </label>)
                                                    )
                                                }
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                :
                                <div className="text-center mt-10 min-h-32">
                                    no Bookmark found!
                                </div>
                            }

                        </div>
                    </section>
                ))
            }
        </>
    );
}