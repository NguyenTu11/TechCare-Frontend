import type { Product } from "./product"

export interface SearchResult {
    products: Product[]
}

export interface SearchSuggestion {
    text: string
}

export interface PopularSearch {
    query: string
    count: number
}
