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

export type { Product, collection };
