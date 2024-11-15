

interface IApiFieldsMapping {
    [key: string]: {
        [key: number]: string;
    };
}

export const API_FIELDS_MAPPING: IApiFieldsMapping = {
    category_main_cb: {
        1: "byt",
        2: "dům",
        3: "pozemek",
        4: "komerční nemovitost a nebytový prostor",
        5: "ostatní",
    },
    category_type_cb: {
        1: "prodej",
        2: "pronájem",
        3: "dražba",
        4: "podíl",
    },
    category_sub_cb: {
        1: "N/A",
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
    },
};

export const translateAPIField = (field: string, value: number): string => {
    return API_FIELDS_MAPPING[field]?.[value] || value.toString();
};

export const PER_PAGE_OPTIONS = [10, 20, 50, 100];

