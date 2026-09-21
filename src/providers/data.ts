import type { BaseRecord, CrudFilter, DataProvider, CreateParams, CreateResponse, GetListParams, GetListResponse, DeleteOneParams, DeleteOneResponse, GetOneParams, GetOneResponse, UpdateParams, UpdateResponse } from "@refinedev/core";
import { createSimpleRestDataProvider } from "@refinedev/rest/simple-rest";
import { API_URL } from "./constants";
import { TOKEN_KEY } from "./constants";

const { dataProvider: restProvider, kyInstance: baseKy } = createSimpleRestDataProvider({
  apiURL: API_URL,
});
const kyInstance = baseKy.extend({
  hooks: { beforeRequest: [(request) => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token) request.headers.set("Authorization", `Bearer ${token}`);
  }] },
});

type RecordValue = string | number | boolean | null | undefined;
type ApiRecord = Record<string, RecordValue>;

const searchableFields: Record<string, string[]> = {
  categories: ["name", "description"],
  products: ["name", "description", "categoryId"],
  extras: ["name"],
  tables: ["code"],
  tabs: ["id", "tableCode"],
};

function matchesFilter(record: ApiRecord, filter: CrudFilter, resource: string): boolean {
  if ("field" in filter) {
    const { field, operator, value } = filter;
    if (value === undefined || value === null || value === "") return true;
    const needle = String(value).toLocaleLowerCase("pt-BR");
    if (field === "q") {
      return (searchableFields[resource] ?? []).some((key) =>
        String(record[key] ?? "").toLocaleLowerCase("pt-BR").includes(needle),
      );
    }
    const current = record[field];
    if (operator === "eq") return String(current) === String(value);
    if (operator === "ne") return String(current) !== String(value);
    if (operator === "contains") {
      return String(current ?? "").toLocaleLowerCase("pt-BR").includes(needle);
    }
    if (operator === "in" && Array.isArray(value)) {
      return value.some((entry) => String(entry) === String(current));
    }
    const a = Number(current);
    const b = Number(value);
    if (operator === "gte") return a >= b;
    if (operator === "lte") return a <= b;
    return true;
  }
  return filter.operator === "or"
    ? filter.value.some((item) => matchesFilter(record, item, resource))
    : filter.value.every((item) => matchesFilter(record, item, resource));
}

export { kyInstance };

export const dataProvider: DataProvider = {
  ...restProvider,
  create: async <TData extends BaseRecord = BaseRecord, TVariables = unknown>({ resource, variables }: CreateParams<TVariables>): Promise<CreateResponse<TData>> => {
    const response = await kyInstance.post(resource, { json: variables });
    return { data: await response.json() as TData };
  },
  getList: async <TData extends BaseRecord = BaseRecord>({ resource, pagination, filters = [], sorters = [] }: GetListParams): Promise<GetListResponse<TData>> => {
    const response = await kyInstance.get(resource);
    if (!response.ok) throw new Error(`Erro ao carregar ${resource}: HTTP ${response.status}`);
    const items = (await response.json()) as ApiRecord[];
    if (!Array.isArray(items)) throw new Error(`Resposta inválida para ${resource}`);

    const filtered = items.filter((item) => filters.every((filter) => matchesFilter(item, filter, resource)));
    const sorted = [...filtered].sort((left, right) => {
      for (const { field, order } of sorters) {
        const a = left[field];
        const b = right[field];
        const comparison = typeof a === "number" && typeof b === "number"
          ? a - b
          : String(a ?? "").localeCompare(String(b ?? ""), "pt-BR", { numeric: true });
        if (comparison !== 0) return order === "desc" ? -comparison : comparison;
      }
      return 0;
    });

    const pageSize = pagination?.pageSize ?? 10;
    const currentPage = pagination?.currentPage ?? 1;
    const data = pagination?.mode === "off"
      ? sorted
      : sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    return { data: data as TData[], total: filtered.length };
  },
  getOne: async <TData extends BaseRecord = BaseRecord>({ resource, id }: GetOneParams): Promise<GetOneResponse<TData>> => {
    const response = await kyInstance.get(`${resource}/${id}`);
    if (!response.ok) throw new Error(`Erro ao consultar ${resource}/${id}: HTTP ${response.status}`);
    return { data: await response.json() as TData };
  },
  update: async <TData extends BaseRecord = BaseRecord, TVariables = unknown>({ resource, id, variables }: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> => {
    const response = await kyInstance.put(`${resource}/${id}`, { json: variables });
    if (!response.ok) throw new Error(`Erro ao atualizar ${resource}/${id}: HTTP ${response.status}`);
    return { data: await response.json() as TData };
  },
  deleteOne: async <TData extends BaseRecord = BaseRecord, TVariables = unknown>({ resource, id }: DeleteOneParams<TVariables>): Promise<DeleteOneResponse<TData>> => {
    const response = await kyInstance.delete(`${resource}/${id}`);
    if (!response.ok) throw new Error(`Erro ao excluir ${resource}/${id}: HTTP ${response.status}`);
    return { data: { id } as TData };
  },
};
