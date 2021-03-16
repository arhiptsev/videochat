export interface VkProfile {
    first_name: string;
    id: number;
    last_name: string;
    home_town: string;
    status: string;
    bdate: string;
    bdate_visibility: number;
    city: {
        id: number;
        title: string;
    },
    country: {
        id: number;
        title: string;
    },
    phone: string;
    relation: number;
    screen_name: string;
    sex: number;
    photo_200?: string;
}