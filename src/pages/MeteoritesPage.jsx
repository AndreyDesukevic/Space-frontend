import FiltersPanel from "../components/FiltersPanel";
import MeteoritesTable from "../components/MeteoritesTable";
import Pagination from "../components/Pagination";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSummary } from "../store/summarySlice";

export default function MeteoritesPage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSummary());
    }, [dispatch]);

    return (
        <div className="container-fluid vh-100 d-flex flex-column p-3">
            <div className="app-container">
                <h2 className="mb-3 text-center">Сводка по метеоритам</h2>
                <div className="filters-panel mb-3">
                    <FiltersPanel />
                </div>

                <div className="flex-grow-1 d-flex flex-column page-main">
                    <MeteoritesTable />
                </div>
            </div>

            <div className="pagination-fixed">
                <Pagination />
            </div>
        </div>
    );
}
