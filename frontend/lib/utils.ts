import moment from "moment";

function buildUrl(baseUrl: string, queryParams: Record<string, string | Date | undefined | null>): string {
    let url = baseUrl;
    let firstQueryParam = true;

    for (const key in queryParams) {
        // eslint-disable-next-line no-prototype-builtins
        if (queryParams.hasOwnProperty(key)) {
            if (firstQueryParam) {
                url += `?${key}=${queryParams[key]}`;
                firstQueryParam = false;
            } else {
                url += `&${key}=${queryParams[key]}`;
            }
        }
    }

    return url;
}

const cleanDate = (date: Date | string | null | undefined): string => {
    return moment(date).format("YYYY-MM-DD");
};

const startOfMonth = (): string => {
    const currentDate = new Date();
    currentDate.setDate(1);
    return currentDate.toString();
};

const endOfMonth = (): string => {
    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return lastDayOfMonth.toString();
};

const sleep = (ms: number): Promise<null> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const getInitials = (fullName: string): { initials: string; color: string } => {
    const names = fullName.split(" ");
    let initials = "";

    for (let i = 0; i < names.length; i++) {
        const name = names[i];
        if (name.length > 0) {
            initials += name[0].toUpperCase();
        }
    }

    const colors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#f1c40f", "#e67e22", "#e74c3c"];
    const colorIndex = (initials.charCodeAt(0) + initials.charCodeAt(initials.length - 1)) % colors.length;
    const color = colors[colorIndex];

    return { initials, color };
};

const getGreetingMessage = (name: string): string => {
    const currentTime = moment();
    const hour = currentTime.hour();
    let greeting = "";

    if (hour < 12) {
        greeting = "Good morning";
    } else if (hour < 18) {
        greeting = "Good afternoon";
    } else {
        greeting = "Good evening";
    }

    return `${greeting}, ${name.split(" ")[0]}!`;
};

const currency = (number: number): string => {
    return number.toLocaleString("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
};

const imgSrc = (image: string): string => {
    return `${process.env.NEXT_PUBLIC_IMAGE_URL}/${image}?alt=media`;
};

const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export { buildUrl, cleanDate, currency, startOfMonth, sleep, getInitials, getGreetingMessage, endOfMonth, imgSrc, capitalize };
