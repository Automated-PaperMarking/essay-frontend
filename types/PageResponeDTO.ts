export interface PageResponseDTO<T> {
    data: T[];
    totalPages: number;
    page:number
}