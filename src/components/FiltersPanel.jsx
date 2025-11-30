import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchRecClasses, fetchYearRange } from "../api/meteoriteApi";
import { updateFilters } from "../store/filtersSlice";
import { fetchSummary } from "../store/summarySlice";

export default function FiltersPanel() {
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.filters);
    const [classes, setClasses] = useState([]);
    const [yearRange, setYearRange] = useState({ minYear: 1900, maxYear: new Date().getFullYear() });
    const [error, setError] = useState(null);
    const [fetchError, setFetchError] = useState(null);
    const [loadingMeta, setLoadingMeta] = useState(false);

    useEffect(() => {
        let mounted = true;

        async function loadMeta() {
            setLoadingMeta(true);
            setFetchError(null);
            try {
                const [classesData, rangeData] = await Promise.all([fetchRecClasses(), fetchYearRange()]);
                if (!mounted) return;
                setClasses(classesData || []);
                setYearRange(rangeData || { minYear: 1900, maxYear: new Date().getFullYear() });
            } catch (err) {
                if (!mounted) return;
                console.error("Error loading filter metadata:", err);
                setClasses([]);
                setYearRange({ minYear: 1900, maxYear: new Date().getFullYear() });
                setFetchError('Не удалось загрузить список классов или диапазон лет. Попробуйте позже.');
            } finally {
                if (!mounted) return;
                setLoadingMeta(false);
            }
        }

        loadMeta();

        return () => (mounted = false);
    }, []);

    function onChange(e) {
        const { name, value } = e.target;
        const val = name === 'nameContains' ? value.slice(0, 15) : value;
        dispatch(updateFilters({ [name]: val }));
        setError(null);
    }

    function applyFilters() {
        const yFrom = filters.yearFrom ? Number(filters.yearFrom) : null;
        const yTo = filters.yearTo ? Number(filters.yearTo) : null;
        if (yFrom && yTo && yFrom > yTo) {
            setError('Год "с" не может быть больше года "по"');
            return;
        }

        if (filters.nameContains && filters.nameContains.length > 15) {
            setError('Ограничение на длину имени: 15 символов');
            return;
        }

        dispatch(updateFilters({ page: 1 }));
        dispatch(fetchSummary());
    }

    function resetFilters() {
        dispatch({ type: 'filters/resetFilters' });
        dispatch(fetchSummary());
        setError(null);
    }

    return (
        <div className="card p-3 mb-3">
            <div className="row g-2">

                <div className="col-2">
                    <select
                        className="form-select"
                        name="yearFrom"
                        value={filters.yearFrom}
                        onChange={onChange}
                    >
                        <option value="">Год от</option>
                        {Array.from(
                            { length: yearRange.maxYear - yearRange.minYear + 1 },
                            (value, i) => yearRange.minYear + i
                        ).map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-2">
                    <select
                        className="form-select"
                        name="yearTo"
                        value={filters.yearTo}
                        onChange={onChange}
                    >
                        <option value="">Год до</option>
                        {Array.from(
                            { length: yearRange.maxYear - yearRange.minYear + 1 },
                            (value, i) => yearRange.minYear + i
                        ).map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-3">
                    <input
                        className="form-control"
                        name="nameContains"
                        placeholder="Часть названия (макс 15)"
                        value={filters.nameContains}
                        onChange={onChange}
                    />
                </div>

                <div className="col-3">
                    <select
                        className="form-select"
                        name="recClass"
                        value={filters.recClass}
                        onChange={onChange}
                    >
                        <option value="">Все классы</option>
                        {classes.map((c) => (
                            <option key={c.id} value={c.name}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-2 d-flex flex-column gap-2">
                    <button className="btn btn-primary w-100" onClick={applyFilters}>
                        Применить
                    </button>
                    <button className="btn btn-outline-secondary w-100" onClick={resetFilters}>
                        Сброс
                    </button>
                </div>

            </div>
            {error && (
                <div className="mt-2 col-12">
                    <div className="alert alert-danger py-2">{error}</div>
                </div>
            )}
        </div>
    );
}
