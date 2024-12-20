import { IJsonTableProps, IJsonTableProp } from "@/components/JsonToTable/JsonToTable";
import UpdateButton from "@/components/UpdateButton/UpdateButton";
import { Link } from "react-router-dom";

interface IApiFieldsMapping {
    [key: string]: {
        name: string;
        data: {
            [key: number]: string;
        };
    };
}

export const API_FIELDS_MAPPING: IApiFieldsMapping = {
    category_type_cb: {
        name: "Typ inzerátu",
        data: {
            1: "Prodej",
            2: "Pronájem",
            3: "Dražba",
            4: "Podíl",
        }
    },
    category_main_cb: {
        name: "Kategorie",
        data: {
            1: "Byt",
            2: "Dům",
            3: "Pozemek",
            4: "Komerční",
            5: "Ostatní",
        }
    },
    category_sub_cb: {
        name: "Typ nemovitosti",
        data: {
            2: "1+kk",
            3: "1+1",
            4: "2+kk",
            5: "2+1",
            6: "3+kk",
            7: "3+1",
            8: "4+kk",
            9: "4+1",
            10: "5+kk",
            11: "5+1",
            12: "6+více",
            16: "Atypický",
            18: "Komerční",
            19: "Bydlení",
            20: "Pole",
            21: "Lesy",
            22: "Louky",
            23: "Zahrady",
            24: "Ostatní",
            25: "Kanceláře",
            26: "Sklady",
            27: "Výroba",
            28: "Obchodní prostory",
            29: "Ubytování",
            30: "Restaurace",
            31: "Zemědělský",
            32: "Ostatní",
            33: "Chata",
            34: "Garáž",
            35: "Památka/jiné",
            36: "Ostatní",
            37: "Rodinný",
            38: "Činžovní dům",
            39: "Vila",
            40: "Naklíč",
            43: "Chalupa",
            44: "Zemědělská usedlost",
            46: "Rybníky",
            47: "Pokoj",
            48: "Sady/vinice",
            49: "Virtuální kancelář",
            50: "Vinný sklep",
            51: "Půdní prostor",
            52: "Garážové stání",
            53: "Mobilheim",
            54: "Vícegenerační dům",
            56: "Ordinace",
            57: "Apartmány",
        }
    },
};

export const translateAPIField = (field: string, value: number): string => {
    return API_FIELDS_MAPPING[field]?.data[value] || value.toString();
};
// example: translateAPIField("category_type_cb", 1) => "prodej"

// translate the other way around
export const translateAPIFieldReverse = (field: string, value: string): number => {
    return parseInt(Object.entries(API_FIELDS_MAPPING[field]?.data).find(([val]) => val === value)?.[0] || value);
};
// example: translateAPIFieldReverse("category_type_cb", "prodej") => 1

export const PER_PAGE_OPTIONS = [10, 20, 50, 100];


export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('cs-CZ', {
        style: 'currency',
        currency: 'CZK',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}


// implement interface for table API data
export interface IEstate {
    [key: string]: any;
}

export const formatDataForTable = (estates: IEstate[], onUpdate: any): IJsonTableProps => {
    return {
        rows: estates.map((estate: IEstate): IJsonTableProp => {
            // translate data from API
            const estateData = {
                "Název": estate.name,
                "Typ inzerátu": translateAPIField("category_type_cb", estate.seo.category_type_cb),
                "Kategorie": translateAPIField("category_main_cb", estate.seo.category_main_cb),
                "Typ nemovitosti": translateAPIField("category_sub_cb", estate.seo.category_sub_cb),
                "Lokalita": estate.locality,
                "Cena": formatCurrency(estate.price),
                "Fotka": <Link to={estate._links.images[0].href} target="_blank" rel="noopener noreferrer">Zobrazit fotku</Link>,
                "Detail": <Link to={`estate/${estate.hash_id}`}>Zobrazit detail</Link>,
            };

            // add update button
            return {
                ...estateData,
                "Změny": (
                    <UpdateButton
                        dataToDisplay={estateData}
                        onUpdate={(newData: IJsonTableProp) => onUpdate(newData, estate)}
                    />
                ),
            };
        }),
    };
};

export const formatDataToAPI = (newData: IJsonTableProp, estate: IEstate): IEstate => {
    return {
        ...estate,
        name: newData["Název"],
        seo: {
            category_type_cb: translateAPIFieldReverse("category_type_cb", newData["Typ inzerátu"]),
            category_main_cb: translateAPIFieldReverse("category_main_cb", newData["Kategorie"]),
            category_sub_cb: translateAPIFieldReverse("category_sub_cb", newData["Typ nemovitosti"]),
        },
        locality: newData["Lokalita"],
        price: parseInt(newData["Cena"].replace(/\s/g, ""), 10),
    };
};