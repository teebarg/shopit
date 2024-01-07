type collection = {
    id: number;
    name: string;
};

type Product = {
    id: number;
    name: string;
    image: string;
    price: number;
    collections?: collection[];
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

export type { Product, collection, User };
