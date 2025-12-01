import { useSelector, useDispatch } from "react-redux";
import { updateFilters } from "../store/filtersSlice";
import { fetchSummary } from "../store/summarySlice";

export default function MeteoritesTable() {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.summary);
    const filters = useSelector((state) => state.filters);

    function sort(field) {
        const order = filters.sortOrder === "asc" ? "desc" : "asc";

        dispatch(updateFilters({ sortField: field, sortOrder: order, page: 1 }));
        dispatch(fetchSummary());
    }

    if (error) {
        return <div className="alert alert-danger">Ошибка загрузки данных: {error}</div>;
    }

    if (!items) {
        return <p className="text-muted">Нет данных для отображения</p>;
    }

    return (
        <div className="table-wrapper d-flex flex-column h-100">
            <div className="table-responsive table-header">
                <table className="table table-striped mb-0">
                    <thead className="table-sticky">
                        <tr>
                            <th onClick={() => sort("year")} style={{ cursor: "pointer" }}>
                                Год {filters.sortField === "year" ? (filters.sortOrder === "asc" ? "▲" : "▼") : ""}
                            </th>
                            <th onClick={() => sort("count")} style={{ cursor: "pointer" }}>
                                Кол-во {filters.sortField === "count" ? (filters.sortOrder === "asc" ? "▲" : "▼") : ""}
                            </th>
                            <th onClick={() => sort("totalMass")} style={{ cursor: "pointer" }}>
                                Масса {filters.sortField === "totalMass" ? (filters.sortOrder === "asc" ? "▲" : "▼") : ""}
                            </th>
                        </tr>
                    </thead>
                </table>
            </div>

            <div className="table-scroll flex-grow-1" style={{ position: "relative" }}>
                <table className="table table-striped mb-0">
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={3} className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Загрузка...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            items.map((row, idx) => (
                                <tr key={row.year || idx}>
                                    <td>{row.year}</td>
                                    <td>{row.count}</td>
                                    <td>{row.totalMass}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {!loading && items && items.length === 0 && (
                    <div className="no-data-overlay">
                        <div className="no-data-message text-muted">Нет данных для отображения</div>
                    </div>
                )}
            </div>
        </div>
    );
}
