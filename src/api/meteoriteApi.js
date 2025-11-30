const API_BASE_URL = "https://localhost:5001/api/Meteorite";

export async function fetchMeteorites(query) {
  const params = new URLSearchParams();

  if (query.yearFrom) params.append("yearFrom", query.yearFrom);
  if (query.yearTo) params.append("yearTo", query.yearTo);
  if (query.recClass) params.append("recClass", query.recClass);
  if (query.nameContains) params.append("nameContains", query.nameContains);

  params.append("sortField", query.sortField || "year");
  params.append("sortOrder", query.sortOrder || "asc");

  params.append("page", query.page || 1);
  params.append("pageSize", query.pageSize || 20);

  const url = `${API_BASE_URL}/summary?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Ошибка загрузки данных: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export async function fetchRecClasses() {
  const url = `${API_BASE_URL}/classes`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Ошибка загрузки классов");
  }

  const data = await response.json();

  return Array.isArray(data) ? data : [];
}

export async function fetchYearRange() {
  const url = `${API_BASE_URL}/year-range`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Ошибка загрузки диапазона лет");
  }

  const data = await response.json();

  return {
    minYear: data.minYear ?? 1900,
    maxYear: data.maxYear ?? new Date().getFullYear()
  };
}