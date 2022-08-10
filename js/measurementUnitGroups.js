Converter.measurementUnitGroups = {
    area: {
        icon: `<i class="fa fa-area-chart" aria-hidden="true"></i>`,
        list: [
            {id: "nm2", value: 1e18, names: {short: "nm&sup2", full: "square nanometer"}, group: "Metric system"},
            {id: "mcm2", value: 1e12, names: {short: "mcm&sup2", full: "square micrometer"}, group: "Metric system"},
            {id: "mm2", value: 1e6, names: {short: "mm&sup2", full: "square millimeter"}, group: "Metric system"},
            {id: "cm2", value: 1e4, names: {short: "cm&sup2", full: "square centimeter"}, group: "Metric system"},
            {id: "dm2", value: 1e2, names: {short: "dm&sup2", full: "square decimeter"}, group: "Metric system"},
            {id: "m2", value: 1, names: {short: "m&sup2", full: "square meter"}, group: "Metric system"},
            {id: "ar", value: 1e-2, names: {short: "a", full: "ar/hectare"}, group: "Metric system"},
            {id: "ha", value: 1e-4, names: {short: "ha", full: "hectare"}, group: "Metric system"},
            {id: "km2", value: 1e-6, names: {short: "km&sup2", full: "square kilometer"}, group: "Metric system"},

            {id: "township", value: 1.072506e-8, names: {full: "township"}, group: "Anglo-american units"},
            {id: "mi2", value: 3.861022e-7, names: {short: "mi&sup2", full: "square mile"}, group: "Anglo-american units"},
            {id: "homestead", value: 0.000001544409, names: {full: "homestead"}, group: "Anglo-american units"},
            {id: "acre", value: 0.0002471055, names: {short: "acre", full: "acre"}, group: "Anglo-american units"},
            {id: "rod", value: 0.0009884220, names: {short: "rod", full: "rod"}, group: "Anglo-american units"},
            {id: "rod2", value: 0.03953687, names: {short: "rod&sup2", full: "square rod"}, group: "Anglo-american units"},
            {id: "yd2", value: 1.195990, names: {short: "yd&sup2", full: "square yard"}, group: "Anglo-american units"},
            {id: "ft2", value: 10.76391, names: {short: "ft&sup2", full: "square foot"}, group: "Anglo-american units"},
            {id: "in2", value: 1550, names: {short: "in&sup2", full: "square inch"}, group: "Anglo-american units"},

        ],
    },
    length:{
        icon: `<i class='fas fa-ruler'></i>`,
        list: [
            {id: "nm", value: 1e9, names: {short: "nm", full: "nanometer"}, group: "Metric system"},
            {id: "mcm", value: 1e6, names: {short: "mcm", full: "micrometer"}, group: "Metric system"},
            {id: "mm", value: 1e3, names: {short: "mm", full: "milimeter"}, group: "Metric system"},
            {id: "cm", value: 1e2, names: {short: "cm", full: "centimeter"}, group: "Metric system"},
            {id: "dm", value: 10, names: {short: "dm", full: "decimeter"}, group: "Metric system"},
            {id: "m", value: 1, names: {short: "m", full: "meter"}, group: "Metric system"},
            {id: "km", value: 1e-3, names: {short: "km", full: "kilometer"}, group: "Metric system"},

            {id: "league", value: 2.0712373074577798987247806145444e-4, names: {full: "league"}, group: "Anglo-american units"},
            {id: "mi", value: 6.2137119223733396961743418436332e-4, names: {short: "mi", full: "mile"}, group: "Anglo-american units"},
            {id: "chain", value: 0.049709695378986717569394734749065, names: {full: "chain"}, group: "Anglo-american units"},
            {id: "rd", value: 0.19883878151594687027757893899626, names: {short: "rd", full: "rod"}, group: "Anglo-american units"},
            {id: "yd", value: 1.0936132983377077865266841644794, names: {short: "yd", full: "yard"}, group: "Anglo-american units"},
            {id: "ft", value: 3.2808398950131233595800524934383, names: {short: "ft", full: "foot"}, group: "Anglo-american units"},
            {id: "in", value: 39.37007874015748031496062992126, names: {short: "in", full: "inch"}, group: "Anglo-american units"},
        ]
    },
    temperature:{
        icon: `<i class="fas fa-thermometer-half"></i>`,
        manual: true,
        list: [
            {id: "K", names: {short: "K", full: "kelvin degree"}, manualConverts: {
                C: K => K - 273.15,
                F: K => ((K - 273.15) * 1.8) + 32,
                R: K => (K - 273.15) * 0.8
            }},
            {id: "C", names: {short: "&degC", full: "celcius degree"}, manualConverts: {
                K: C => C + 273.15,
                F: C => (C * 1.8) + 32,
                R: C => C * 0.8
            }},
            {id: "F", names: {short: "&degF", full: "fahrenheit degree"}, manualConverts: {
                K: F => (F - 32) / 1.8 + 273.15,
                C: F => (F - 32) / 1.8,
                R: F => (F - 32) * 0.44444
            }},
            {id: "R", names: {short: "&degR", full: "réaumur degree"}, manualConverts: {
                K: R => (R / 0.8) + 273.15,
                F: R => (R * 2.25) + 32,
                C: R => R / 0.8,
            }}
        ]
    },
    volume: {
        icon: `<i class="fa fa-cube" aria-hidden="true"></i>`,
        list: [
            {id: "mcl", value: 1000000, names: {short: "mcl", full: "microliter"}, group: "Metric system"},
            {id: "mm3", value: 1000000, names: {short: "mm&sup3", full: "cubic milimeter"}, group: "Metric system"},
            {id: "ml", value: 1000, names: {short: "ml", full: "mililiter"}, group: "Metric system"},
            {id: "cm3", value: 1000, names: {short: "cm&sup3", full: "cubic centimeter"}, group: "Metric system"},
            {id: "cl", value: 100, names: {full: "centiliter"}, group: "Metric system"},
            {id: "dl", value: 10, names: {full: "deciliter"}, group: "Metric system"},
            {id: "l", value: 1, names: {full: "liter"}, group: "Metric system"},
            {id: "dm3", value: 1, names: {short: "dm&sup3", full: "cubic decimeter"}, group: "Metric system"},
            {id: "hl", value: 0.1, names: {full: "hectoliter"}, group: "Metric system"},
            {id: "m3", value: 0.001, names: {short: "m&sup3", full: "cubic meter"}, group: "Metric system"},
            {id: "km3", value: 1e-12, names: {short: "km&sup3", full: "cubic kilometer"}, group: "Metric system"},

            {id: "ba", value: 0.006110602, names: {full: "barrel"}, group: "British imperial (dry)"},
            {id: "bu", value: 0.02749610, names: {short: "bu", full: "bushel"}, group: "British imperial (dry)"},
            {id: "pk", value: 0.1099844, names: {short: "pk", full: "pek"}, group: "British imperial (dry)"},
            {id: "gal", value: 0.2199688, names: {short: "gal", full: "gallon"}, group: "British imperial (dry)"},
            {id: "qt", value: 0.8798751, names: {short: "qt", full: "quart"}, group: "British imperial (dry)"},
            {id: "pt", value: 1.759751, names: {short: "pt", full: "pint"}, group: "British imperial (dry)"},

            {id: "oz", value: 35.19501, names: {short: "oz", full: "fluid ounce"}, group: "British imperial (fluid)"},
        ],
    },
    weight: {
        icon: `<i class="fas fa-weight-hanging"></i>`,
        list: [
            {id: "aom", value: 6.022045e26, names: {short: "u", full: "a.o.m"}, group: "Metric system"},
            {id: "ng", value: 1000000000000, names: {short: "ng", full: "nanogram"}, group: "Metric system"},
            {id: "mcg", value: 1000000000, names: {short: "mcg", full: "microgram"}, group: "Metric system"},
            {id: "mg", value: 1000000, names: {short: "mg", full: "miligram"}, group: "Metric system"},
            {id: "stg", value: 100000, names: {full: "sentigram"}, group: "Metric system"},
            {id: "karat", value: 5000, names: {full: "karat"}, group: "Metric system"},
            {id: "g", value: 1000, names: {short: "g", full: "gram"}, group: "Metric system"},
            {id: "dag", value: 100, names: {short: "dag", full: "decagram"}, group: "Metric system"},
            {id: "hg", value: 10, names: {short: "hg", full: "hectogram"}, group: "Metric system"},
            {id: "kg", value: 1, names: {short: "kg", full: "kilogram"}, group: "Metric system"},
            {id: "kH", value: 0.009806652, names: {short: "kH", full: "kilonewton"}, group: "Metric system"},
            {id: "t", value: 0.001, names: {short: "t", full: "ton"}, group: "Metric system"},
        ],
    },
    data: {
        icon: `<i class="fa fa-database" aria-hidden="true"></i>`,
        list: [
            {id: "EB", value: 9.094948e-13, names: {short: "EB", full: "exabyte"}},
            {id: "PB", value: 9.313227e-10, names: {short: "PB", full: "petabyte"}},
            {id: "TB", value: 9.536744e-7, names: {short: "TB", full: "terabyte"}},
            {id: "GB", value: 0.0009765625, names: {short: "GB", full: "gigabyte"}},
            {id: "MB", value: 1, names: {short: "MB", full: "megabyte"}},
            {id: "kB", value: 1024, names: {short: "kB", full: "kilobyte"}},
            {id: "B", value: 1048576, names: {short: "B", full: "byte"}},
            {id: "bit", value: 8388608, names: {short: "", full: "bit"}},
            {id: "kbit", value: 8192, names: {short: "kbit", full: "kilobit"}},
            {id: "mbit", value: 8, names: {short: "mbit", full: "megabit"}},
            {id: "gbit", value: 0.007812500, names: {short: "gbit", full: "gigabit"}},
            {id: "tbit", value: 0.000007629395, names: {short: "tbit", full: "terabit"}},
            {id: "pbit", value: 7.450581e-9, names: {short: "pbit", full: "petabit"}},
            {id: "exabit", value: 7.275958e-12, names: {short: "", full: "exabit"}},
        ],
    },
    speed: {
        icon: `<i class="fas fa-tachometer-alt"></i>`,
        list: [

        ],
    }
}