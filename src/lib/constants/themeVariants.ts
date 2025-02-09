export type VariantInfo = {
    variant: Variant<Theme>,
    color: string,
}
export type VariantWrap = {
    [key in Theme]: VariantInfo[];
}

const variants: VariantWrap =
{
    moon: [
        { variant: 'greink', 'color': "hsl(171, 54%, 47%)" },
        { variant: 'piey', 'color': "hsl(330, 83%, 69%)" },
    ],
    sun: [
        { variant: "maglet", color: "hsl(283, 100%, 43%)" },
        { variant: "edge", 'color': "hsl(355, 66%, 39%)" },
    ]
}

export default variants;