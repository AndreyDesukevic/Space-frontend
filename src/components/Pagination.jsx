import { useDispatch, useSelector } from "react-redux";
import { updateFilters } from "../store/filtersSlice";
import { fetchSummary } from "../store/summarySlice";

export default function Pagination() {
    const dispatch = useDispatch();
    const { page, pageSize } = useSelector((state) => state.filters);
    const { totalPages } = useSelector((state) => state.summary);

    function go(p) {
        dispatch(updateFilters({ page: p }));
        dispatch(fetchSummary());
    }

    function changePageSize(e) {
        const newSize = Number(e.target.value);
        dispatch(updateFilters({ pageSize: newSize, page: 1 }));
        dispatch(fetchSummary());
    }

    const pages = [];
    const maxButtons = 7;
    let start = Math.max(1, page - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;
    if (end > totalPages) {
        end = totalPages;
        start = Math.max(1, end - maxButtons + 1);
    }

    for (let p = start; p <= end; p++) pages.push(p);

    return (
        <div className="d-flex align-items-center gap-2">
            <button className="btn btn-secondary" disabled={page <= 1} onClick={() => go(page - 1)}>
                Назад
            </button>

            {start > 1 && (
                <>
                    <button className="btn btn-outline-secondary" onClick={() => go(1)}>1</button>
                    {start > 2 && <span className="px-1">…</span>}
                </>
            )}

            {pages.map((p) => (
                <button
                    key={p}
                    className={"btn " + (p === page ? "btn-primary" : "btn-outline-secondary")}
                    onClick={() => go(p)}
                >
                    {p}
                </button>
            ))}

            {end < totalPages && (
                <>
                    {end < totalPages - 1 && <span className="px-1">…</span>}
                    <button className="btn btn-outline-secondary" onClick={() => go(totalPages)}>{totalPages}</button>
                </>
            )}

            <button className="btn btn-secondary" disabled={page >= totalPages} onClick={() => go(page + 1)}>
                Вперёд
            </button>

            <div className="ms-3 d-flex align-items-center gap-2">
                <label className="mb-0">На странице:</label>
                <select className="form-select form-select-sm" value={pageSize} onChange={changePageSize} style={{width: '6rem'}}>
                    {[10,20,50,100].map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
