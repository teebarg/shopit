type Collection = {
    id?: number;
    name: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
};

type Product = {
    id?: number;
    name: string;
    image?: string;
    is_active: boolean;
    price?: number;
    collections?: Collection[];
    tags?: Tag[];
    created_at?: string;
    updated_at?: string;
};

type User = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    created_at: string;
    updated_at: string;
};

type Tag = {
    id?: number;
    name: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
};

type Pagination = {
    page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
};

export type { Product, Collection, User, Tag, Pagination };
