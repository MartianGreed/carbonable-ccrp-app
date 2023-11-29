import { useQuery } from "@apollo/client";
import Pagination from "../../common/Pagination";
import type { Annual } from "~/graphql/__generated__/graphql";
import { ErrorReloadTable, NoDataTable } from "../../common/ErrorReload";
import Title from "~/components/common/Title";
import TableLoading from "~/components/table/TableLoading";
import { ANNUAL } from "~/graphql/queries/net-zero";
import { CARBONABLE_COMPANY_ID } from "~/utils/constant";

export default function ProjectDecarbonationTable() {
    const currentPage = 1;
    const resultsPerPage = 5;
    const { loading, error, data, refetch } = useQuery(ANNUAL, {
        variables: {
            view: {
                company_id: CARBONABLE_COMPANY_ID
            }
        }
    });

    if (error) {
        console.error(error);
    }

    const refetchData = () => {
        refetch();
    }

    const annual: Annual[] = data?.annual;

    const handlePageClick = (data: any) => {
        refetch();
    }
    
    return (
        <div className="mt-12 w-full">
            <Title title="Annual" />
            <div className="mt-4 w-full font-inter text-sm overflow-x-auto border border-neutral-600">
                <table className="table-auto text-left min-w-full">
                    <thead className="bg-neutral-500 text-neutral-100 whitespace-nowrap h-10">
                        <tr>
                            <th className="px-4 sticky left-0 z-10 bg-neutral-500">Time Period</th>
                            <th className="px-4">Emission</th>
                            <th className="px-4">Ex-Post Issued</th>
                            <th className="px-4">Ex-Post Purchased</th>
                            <th className="px-4">Ex-Post Retired</th>
                            <th className="px-4">Neutrality Target</th>
                            <th className="px-4">Actual Rate</th>
                            <th className="px-4">Delta %</th>
                            <th className="px-4">Debt</th>
                            <th className="px-4">Ex-Post Stock</th>
                            <th className="px-4">Ex-ante Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && <TableLoading resultsPerPage={resultsPerPage} numberOfColumns={11} />}
                        {!loading && !error && <ProjectedDecarbonationLoaded annual={annual} />}
                        {error && <ErrorReloadTable refetchData={refetchData} /> }
                    </tbody>
                </table>
            </div>
            <div className="mt-8">
                <Pagination pageCount={currentPage} handlePageClick={handlePageClick} />
            </div>
        </div>
    );
}

function ProjectedDecarbonationLoaded({ annual }: { annual: Annual[] }) {
    if (annual.length === 0) {
        return <NoDataTable />
    }

    return (
        <>
            {annual.map((data: Annual, idx: number) => {
                const { time_period, emissions, ex_post_issued, ex_post_purchased, ex_post_retired, target, actual_rate, delta, debt, ex_post_stock, ex_ante_stock } = data;

                if (!time_period) {
                    return null;
                }

                return (
                    <tr key={`projection_${idx}`} className={`border-b border-neutral-600 bg-neutral-800 h-12 last:border-b-0 hover:brightness-110 ${parseInt(time_period) < new Date().getFullYear() ? "text-neutral-50" : "text-neutral-200"}`}>
                        <td className="px-4 sticky left-0 z-10 bg-neutral-800">{time_period}</td>
                        <td className="px-4">{emissions}</td>
                        <td className="px-4">{ex_post_issued}</td>
                        <td className="px-4">{ex_post_purchased}</td>
                        <td className="px-4">{ex_post_retired}</td>
                        <td className="px-4">{target}</td>
                        <td className="px-4">{actual_rate}</td>
                        <td className="px-4">{delta ? delta : 'n/a'}</td>
                        <td className="px-4">{debt}</td>
                        <td className="px-4">{ex_post_stock}</td>
                        <td className="px-4">{ex_ante_stock}</td>
                    </tr>
                )
            })}
        </>
    )
}
