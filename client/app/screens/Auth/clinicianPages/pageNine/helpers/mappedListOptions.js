const stateList = [
    {
        "name": "Alabama",
        "abbreviation": "AL"
    },
    {
        "name": "Alaska",
        "abbreviation": "AK"
    },
    {
        "name": "American Samoa",
        "abbreviation": "AS"
    },
    {
        "name": "Arizona",
        "abbreviation": "AZ"
    },
    {
        "name": "Arkansas",
        "abbreviation": "AR"
    },
    {
        "name": "California",
        "abbreviation": "CA"
    },
    {
        "name": "Colorado",
        "abbreviation": "CO"
    },
    {
        "name": "Connecticut",
        "abbreviation": "CT"
    },
    {
        "name": "Delaware",
        "abbreviation": "DE"
    },
    {
        "name": "District Of Columbia",
        "abbreviation": "DC"
    },
    {
        "name": "Federated States Of Micronesia",
        "abbreviation": "FM"
    },
    {
        "name": "Florida",
        "abbreviation": "FL"
    },
    {
        "name": "Georgia",
        "abbreviation": "GA"
    },
    {
        "name": "Guam",
        "abbreviation": "GU"
    },
    {
        "name": "Hawaii",
        "abbreviation": "HI"
    },
    {
        "name": "Idaho",
        "abbreviation": "ID"
    },
    {
        "name": "Illinois",
        "abbreviation": "IL"
    },
    {
        "name": "Indiana",
        "abbreviation": "IN"
    },
    {
        "name": "Iowa",
        "abbreviation": "IA"
    },
    {
        "name": "Kansas",
        "abbreviation": "KS"
    },
    {
        "name": "Kentucky",
        "abbreviation": "KY"
    },
    {
        "name": "Louisiana",
        "abbreviation": "LA"
    },
    {
        "name": "Maine",
        "abbreviation": "ME"
    },
    {
        "name": "Marshall Islands",
        "abbreviation": "MH"
    },
    {
        "name": "Maryland",
        "abbreviation": "MD"
    },
    {
        "name": "Massachusetts",
        "abbreviation": "MA"
    },
    {
        "name": "Michigan",
        "abbreviation": "MI"
    },
    {
        "name": "Minnesota",
        "abbreviation": "MN"
    },
    {
        "name": "Mississippi",
        "abbreviation": "MS"
    },
    {
        "name": "Missouri",
        "abbreviation": "MO"
    },
    {
        "name": "Montana",
        "abbreviation": "MT"
    },
    {
        "name": "Nebraska",
        "abbreviation": "NE"
    },
    {
        "name": "Nevada",
        "abbreviation": "NV"
    },
    {
        "name": "New Hampshire",
        "abbreviation": "NH"
    },
    {
        "name": "New Jersey",
        "abbreviation": "NJ"
    },
    {
        "name": "New Mexico",
        "abbreviation": "NM"
    },
    {
        "name": "New York",
        "abbreviation": "NY"
    },
    {
        "name": "North Carolina",
        "abbreviation": "NC"
    },
    {
        "name": "North Dakota",
        "abbreviation": "ND"
    },
    {
        "name": "Northern Mariana Islands",
        "abbreviation": "MP"
    },
    {
        "name": "Ohio",
        "abbreviation": "OH"
    },
    {
        "name": "Oklahoma",
        "abbreviation": "OK"
    },
    {
        "name": "Oregon",
        "abbreviation": "OR"
    },
    {
        "name": "Palau",
        "abbreviation": "PW"
    },
    {
        "name": "Pennsylvania",
        "abbreviation": "PA"
    },
    {
        "name": "Puerto Rico",
        "abbreviation": "PR"
    },
    {
        "name": "Rhode Island",
        "abbreviation": "RI"
    },
    {
        "name": "South Carolina",
        "abbreviation": "SC"
    },
    {
        "name": "South Dakota",
        "abbreviation": "SD"
    },
    {
        "name": "Tennessee",
        "abbreviation": "TN"
    },
    {
        "name": "Texas",
        "abbreviation": "TX"
    },
    {
        "name": "Utah",
        "abbreviation": "UT"
    },
    {
        "name": "Vermont",
        "abbreviation": "VT"
    },
    {
        "name": "Virgin Islands",
        "abbreviation": "VI"
    },
    {
        "name": "Virginia",
        "abbreviation": "VA"
    },
    {
        "name": "Washington",
        "abbreviation": "WA"
    },
    {
        "name": "West Virginia",
        "abbreviation": "WV"
    },
    {
        "name": "Wisconsin",
        "abbreviation": "WI"
    },
    {
        "name": "Wyoming",
        "abbreviation": "WY"
    }
]
const licenseOptions = [{
    label: "Counselor - LCMHC",
    value: "Counselor - LCMHC"
}, { 
    label: "Counselor - LIMHP",
    value: "Counselor - LIMHP"
}, { 
    label: "Counselor - LMHC",
    value: "Counselor - LMHC"
}, { 
    label: "Counselor - LMHP",
    value: "Counselor - LMHP"
}, { 
    label: "Counselor - LPMHC",
    value: "Counselor - LPMHC"
}, { 
    label: "Marriage/Family - LCMFT",
    value: "Marriage/Family - LCMFT"
}, { 
    label: "Marriage/Family - LIMFT",
    value: "Marriage/Family - LIMFT"
}, { 
    label: "Marriage/Family - LMFT",
    value: "Marriage/Family - LMFT"
}, { 
    label: "Professional Counselor - LCPC",
    value: "Professional Counselor - LCPC"
}, { 
    label: "Professional Counselor - LPC",
    value: "Professional Counselor - LPC"
}, { 
    label: "Professional Counselor - LPC-MH",
    value: "Professional Counselor - LPC-MH"
}, { 
    label: "Professional Counselor - LPC-MHSP",
    value: "Professional Counselor - LPC-MHSP"
}, { 
    label: "Professional Counselor - LPCC",
    value: "Professional Counselor - LPCC"
}, { 
    label: "Psychologist - LCP",
    value: "Psychologist - LCP"
}, { 
    label: "Psychologist - LPA",
    value: "Psychologist - LPA"
}, { 
    label: "Psychologist - LPA-IP",
    value: "Psychologist - LPA-IP"
}, { 
    label: "Psychologist - LPP",
    value: "Psychologist - LPP"
}, { 
    label: "Psychologist - Psychoanalyst",
    value: "Psychologist - Psychoanalyst"
}, { 
    label: "Psychologist - Psychologist",
    value: "Psychologist - Psychologist"
}, { 
    label: "Psychologist - Psychologist-Master",
    value: "Psychologist - Psychologist-Master"
}, { 
    label: "Social Worker - CSW",
    value: "Social Worker - CSW"
}, { 
    label: "Social Worker - CSW-PIP",
    value: "Social Worker - CSW-PIP"
}, { 
    label: "Social Worker - LCSW",
    value: "Social Worker - LCSW"
}, { 
    label: "Social Worker - LCSW-C",
    value: "Social Worker - LCSW-C"
}, { 
    label: "Social Worker - LCSW-R",
    value: "Social Worker - LCSW-R"
}, { 
    label: "Social Worker - LICSW",
    value: "Social Worker - LICSW"
}, { 
    label: "Social Worker - LISW",
    value: "Social Worker - LISW"
}, { 
    label: "Social Worker - LISW-CP",
    value: "Social Worker - LISW-CP"
}, { 
    label: "Social Worker - LMSW",
    value: "Social Worker - LMSW"
}, { 
    label: "Social Worker - LSCSW",
    value: "Social Worker - LSCSW"
}, { 
    label: "Social Worker - LSW",
    value: "Social Worker - LSW"
}, { 
    label: "Other - CAP",
    value: "Other - CAP"
}, { 
    label: "Other - Counselor",
    value: "Other - Counselor"
}, { 
    label: "Other - Intern",
    value: "Other - Intern"
}, { 
    label: "Other - Other",
    value: "Other - Other"
}];

export default {
    stateList,
    licenseOptions
}