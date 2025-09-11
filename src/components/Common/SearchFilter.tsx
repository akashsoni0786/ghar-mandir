import Badge from "./Badge";
import "../../styles/Filter.css";
import TextField from "./TextField";
import { FilterIcon } from "@/assets/svgs";
import { DarkBgButton } from "./Buttons";
import { useEffect, useState } from "react";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import useTrans from "@/customHooks/useTrans";
import { useRouter, useSearchParams } from "next/navigation"; // For App Router
// For Pages Router use: import { useRouter } from 'next/router';

interface Props extends DIProps {
  type?: any;
  changedData?: any;
  filters?: any;
  placeholder?: string;
}

const SearchFilter = ({ type, changedData, filters, redux }: Props) => {
  const t = useTrans(redux?.common?.language);
  const router = useRouter();
  const searchParams:any = useSearchParams(); // For App Router
  // For Pages Router: const { query } = useRouter();
  
  const [currFilter, setCurrFilter] = useState(() => {
    // Initialize with URL params if they exist
    const initialFilters = { ...filters };
    const urlSearch = searchParams.get('search'); // For App Router
    // For Pages Router: const urlSearch = query.search as string;
    if (urlSearch) {
      initialFilters.search = urlSearch;
    }
    return initialFilters;
  });

  // Update URL when search term changes (with debounce)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      // For Pages Router: const params = new URLSearchParams(query as Record<string, string>);
      
      if (currFilter.search) {
        params.set('search', currFilter.search);
      } else {
        params.delete('search');
      }
      
      // Update URL without page reload
      router.replace(`?${params.toString()}`, { scroll: false });
      // For Pages Router: router.replace({ query: { ...query, search: currFilter.search } }, undefined, { shallow: true });
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [currFilter.search, router, searchParams]); // Add 'query' for Pages Router

  // Notify parent component of filter changes
  useEffect(() => {
    changedData(currFilter);
  }, [currFilter]);

  return (
    <div className="container filter-container">
      <label className="searchbar-label">{type}</label>
      <div className="searchbar">
        <div className="searchbar-input">
          <TextField
            placeholder={t("Search placeholder") || "e.g Ganesh"}
            value={currFilter?.search ?? ""}
            onChange={(e) => {
              setCurrFilter((prev) => ({
                ...prev,
                search: e,
              }));
            }}
            autoFocus
          />
        </div>
      </div>
      {Object.keys(currFilter)?.length > 1 && (
        <div className="filter">
          {Object.keys(currFilter).map((heading: string) => {
            if (heading !== "search")
              return (
                <div key={heading} className="filter-list">
                  <label className="filter-label">{heading} : </label>
                  <div className="filter-badges">
                    {Object.keys(currFilter[heading]).map((val: any) => {
                      return (
                        <span key={val} style={{ cursor: "pointer" }}>
                          <Badge
                            children={val}
                            showClose={currFilter[heading][val]}
                            variant={
                              currFilter[heading][val] ? "success" : "default"
                            }
                            onClose={() => {
                              setCurrFilter((prev: any) => ({
                                ...prev,
                                [heading]: {
                                  ...prev[heading],
                                  [val]: !prev[heading][val],
                                },
                              }));
                            }}
                            onClick={() => {
                              setCurrFilter((prev: any) => ({
                                ...prev,
                                [heading]: {
                                  ...prev[heading],
                                  [val]: !prev[heading][val],
                                },
                              }));
                            }}
                          />
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
          })}
        </div>
      )}
    </div>
  );
};

export default DI(SearchFilter);


// import Badge from "./Badge";
// import "../../styles/Filter.css";
// import TextField from "./TextField";
// import { FilterIcon } from "@/assets/svgs";
// import { DarkBgButton } from "./Buttons";
// import { useEffect, useState } from "react";
// import { DIProps } from "@/core/DI.types";
// import { DI } from "@/core/DependencyInjection";
// import useTrans from "@/customHooks/useTrans";
// interface Props extends DIProps {
//   type?: any;
//   changedData?: any;
//   filters?: any;
//   placeholder?:string;
// }
// const SearchFilter = ({ type, changedData, filters, redux }: Props) => {
//   const t = useTrans(redux?.common?.language);
//   const [currFilter, setCurrFilter] = useState(filters);
//   useEffect(() => {
//     changedData(currFilter);
//   }, [currFilter]);
//   console.log({currFilter})
//   return (
//     <div className="container filter-container">
//       <label className="searchbar-label"> {type}</label>
//       <div className="searchbar">
//         <div className="searchbar-input">
//           <TextField
//             placeholder="e.g Ganesh"
//             value={currFilter?.search ?? ""}
//             onChange={(e) => {
//               setCurrFilter((prev) => ({
//                 ...prev,
//                 search: e,
//               }));
//             }}
//           />
//         </div>
//         {/* <span className="searchbar-adjust">
//           <FilterIcon />
//         </span> */}
//         {/* <div className="searchbar-button">
//           <DarkBgButton children={"Search"} />
//         </div> */}
//       </div>
//       {Object.keys(currFilter)?.length>1 && <div className="filter">
//         {Object.keys(currFilter).map((heading: string) => {
//           if (heading != "search")
//             return (
//               <div key={heading} className="filter-list">
//                 <label className="filter-label">{heading} : </label>
//                 <div className="filter-badges">
//                   {Object.keys(currFilter[heading]).map((val: any) => {
//                     return (
//                       <span key={val} style={{ cursor: "pointer" }}>
//                         <Badge
//                           children={val}
//                           showClose={currFilter[heading][val]}
//                           variant={
//                             currFilter[heading][val] ? "success" : "default"
//                           }
//                           onClose={() => {
//                             setCurrFilter((prev: any) => ({
//                               ...prev,
//                               [heading]: {
//                                 ...prev[heading],
//                                 [val]: !prev[heading][val],
//                               },
//                             }));
//                           }}
//                           onClick={() => {
//                             setCurrFilter((prev: any) => ({
//                               ...prev,
//                               [heading]: {
//                                 ...prev[heading],
//                                 [val]: !prev[heading][val],
//                               },
//                             }));
//                           }}
//                         />
//                       </span>
//                     );
//                   })}
//                 </div>
//               </div>
//             );
//         })}
//       </div>}
//     </div>
//   );
// };
// export default DI(SearchFilter);
