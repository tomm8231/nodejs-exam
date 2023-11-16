import db from "./connections.js";

await db.items.insertMany([
    { AB_item_number: '64-00001', description: 'UltraLight ASC Mat XSmall Yellow', normal_price: 850, staff_price: 340 },
    { AB_item_number: '64-00021', description: 'Sea to Summit UltraLight ASC Mat Regular Yellow', normal_price: 1200, staff_price: 480 },
    { AB_item_number: '64-00031', description: 'Sea to Summit UltraLight ASC Mat Large Yellow', normal_price: 1300, staff_price: 520 },
    { AB_item_number: '64-00072', description: 'Sea to Summit UltraLight ASC Insulated Mat Regular Orange', normal_price: 1500, staff_price: 600 },
    { AB_item_number: '64-00082', description: 'Sea to Summit UltraLight ASC Insulated Mat Large Orange', normal_price: 1700, staff_price: 680 },
    { AB_item_number: '64-00122', description: 'Sea to Summit Comfort Light ASC Insulated Mat Regular Green', normal_price: 1800, staff_price: 720 },
    { AB_item_number: '64-00202', description: 'Sea to Summit Comfort Plus ASC Insulated Mat Regular Red', normal_price: 2150, staff_price: 860 },
    { AB_item_number: '64-00212', description: 'Sea to Summit Comfort Plus ASC Insulated Mat Large Red', normal_price: 2350, staff_price: 940 },
    { AB_item_number: '64-00254', description: 'Sea to Summit Ether Light XT Insulated Mat Regular Pewter', normal_price: 1950, staff_price: 780 },
    { AB_item_number: '64-00255', description: 'Sea to Summit Ether Light XT Insulated Mat Large Pewter', normal_price: 2200, staff_price: 880 },
    { AB_item_number: '64-00261', description: 'Sea to Summit EtherLightXT Extreme mat Reg Black', normal_price: 2350, staff_price: 940 },
    { AB_item_number: '64-00262', description: 'Sea to Summit EtherLightXT Extreme mat Large Black', normal_price: 2600, staff_price: 1040 },
    { AB_item_number: '64-00263', description: 'Sea to Summit EtherLightXT Extreme mat Rect Reg Wide Black', normal_price: 2600, staff_price: 1040 },
    { AB_item_number: '64-00264', description: 'Sea to Summit EtherLightXT Extreme mat Rect Large Black', normal_price: 2800, staff_price: 1120 },
    { AB_item_number: '64-0035', description: 'Sea to Summit Comfort Light Self Inflating Regular Green', normal_price: 1100, staff_price: 440 },
    { AB_item_number: '64-00352', description: "Sea to Summit Comfort Light SI Women's Regular Aegean", normal_price: 1100, staff_price: 440 },
]);