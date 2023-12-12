import { useQuery } from "@apollo/client";
import { GET_IMPACT_METRICS } from "~/graphql/queries/impact";
import ImpactComponent from "~/components/common/impact/impact";

export default function ProjectsImpact({ businessUnitId }: { businessUnitId: string }) {
    const { loading, error, data, refetch } = useQuery(GET_IMPACT_METRICS, {
        variables: {
            view: {
                business_unit_id: businessUnitId
            }
        }
    });
   
    return (
        <ImpactComponent 
            loading={loading}
            error={error}
            data={data}
            refetch={refetch}
        />
    )
}