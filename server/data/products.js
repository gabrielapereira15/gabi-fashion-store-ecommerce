/**
 * Catalogue seed data.
 *
 * `productId` doubles as the image filename: client/public/images/<productId>.webp
 * The client falls back to this same list (mirrored in client/src/data/demoProducts.js)
 * when the API is unreachable, so keep the two in sync.
 */
module.exports = [
    {
        productId: 'suit1',
        productName: 'Saffron Track Set',
        productType: 'Loungewear',
        productColor: 'Saffron',
        value: 128,
        description: 'Cropped hoodie and tapered joggers in a brushed cotton blend.'
    },
    {
        productId: 'suit2',
        productName: 'Ivory Tailored Co-Ord',
        productType: 'Co-Ords',
        productColor: 'Ivory',
        value: 189,
        description: 'Relaxed shirt and straight-leg trousers cut from crisp poplin.'
    },
    {
        productId: 'suit3',
        productName: 'Highgate Check Blazer',
        productType: 'Blazers',
        productColor: 'Grey Check',
        value: 245,
        description: 'Oversized double-breasted blazer in a soft Prince of Wales check.'
    },
    {
        productId: 'suit4',
        productName: 'Retro Stripe Track Jacket',
        productType: 'Outerwear',
        productColor: 'White',
        value: 112,
        description: 'Cropped zip-through jacket with contrast taping along the sleeve.'
    },
    {
        productId: 'suit5',
        productName: 'Pearl Collar Blouse',
        productType: 'Blouses',
        productColor: 'Ivory',
        value: 96,
        description: 'Poplin blouse with a detachable beaded collar and blouson sleeve.'
    },
    {
        productId: 'suit6',
        productName: 'Sand Ruffle Midi Skirt',
        productType: 'Skirts',
        productColor: 'Sand',
        value: 134,
        description: 'Bias-cut midi with a cascading ruffle and elasticated waist.'
    },
    {
        productId: 'suit7',
        productName: 'Side-Stripe Sweatshirt',
        productType: 'Sweatshirts',
        productColor: 'White',
        value: 88,
        description: 'Loop-back cotton sweatshirt with a graphic stripe down each sleeve.'
    },
    {
        productId: 'suit8',
        productName: 'Charcoal City Blazer',
        productType: 'Blazers',
        productColor: 'Charcoal',
        value: 268,
        description: 'Single-breasted wool-blend blazer with structured shoulders.'
    },
    {
        productId: 'suit9',
        productName: 'Noir Wool Coat',
        productType: 'Coats',
        productColor: 'Black',
        value: 342,
        description: 'Longline wool coat with a wide notch lapel and hidden placket.'
    },
    {
        productId: 'suit10',
        productName: 'Sand Longline Trench',
        productType: 'Coats',
        productColor: 'Sand',
        value: 298,
        description: 'Featherweight trench in a fluid twill that falls below the knee.'
    },
    {
        productId: 'suit11',
        productName: 'Marlow Check Mini Dress',
        productType: 'Dresses',
        productColor: 'Grey Check',
        value: 156,
        description: 'A-line mini dress in brushed check with a pointed collar.'
    },
    {
        productId: 'suit12',
        productName: 'Blush Off-Shoulder Blouse',
        productType: 'Blouses',
        productColor: 'Blush',
        value: 124,
        description: 'Sheer polka-dot blouse with volume sleeves and a smocked neckline.'
    }
];
