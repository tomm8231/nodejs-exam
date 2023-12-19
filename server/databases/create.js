import db from "./connections.js";

await db.createCollection("products");

await db.collection("products").insertMany([
    { item_number: '64-00001', item: 'UltraLight ASC Mat XSmall Yellow', normal_price: 850, staff_price: 340, round: "s2s_oct_24" },
    { item_number: '64-00021', item: 'Sea to Summit UltraLight ASC Mat Regular Yellow', normal_price: 1200, staff_price: 480, round: "s2s_oct_24" },
    { item_number: '64-00031', item: 'Sea to Summit UltraLight ASC Mat Large Yellow', normal_price: 1300, staff_price: 520, round: "s2s_oct_24" },
    { item_number: '64-00072', item: 'Sea to Summit UltraLight ASC Insulated Mat Regular Orange', normal_price: 1500, staff_price: 600, round: "s2s_oct_24" },
    { item_number: '64-00082', item: 'Sea to Summit UltraLight ASC Insulated Mat Large Orange', normal_price: 1700, staff_price: 680, round: "s2s_oct_24" },
    { item_number: '64-00122', item: 'Sea to Summit Comfort Light ASC Insulated Mat Regular Green', normal_price: 1800, staff_price: 720, round: "s2s_oct_24" },
    { item_number: '64-00202', item: 'Sea to Summit Comfort Plus ASC Insulated Mat Regular Red', normal_price: 2150, staff_price: 860, round: "s2s_oct_24" },
    { item_number: '64-00212', item: 'Sea to Summit Comfort Plus ASC Insulated Mat Large Red', normal_price: 2350, staff_price: 940, round: "s2s_oct_24" },
    { item_number: '64-00254', item: 'Sea to Summit Ether Light XT Insulated Mat Regular Pewter', normal_price: 1950, staff_price: 780, round: "s2s_oct_24" },
    { item_number: '64-00255', item: 'Sea to Summit Ether Light XT Insulated Mat Large Pewter', normal_price: 2200, staff_price: 880, round: "s2s_oct_24" },
    { item_number: '64-00261', item: 'Sea to Summit EtherLightXT Extreme mat Reg Black', normal_price: 2350, staff_price: 940, round: "s2s_oct_24" },
    { item_number: '64-00262', item: 'Sea to Summit EtherLightXT Extreme mat Large Black', normal_price: 2600, staff_price: 1040, round: "s2s_oct_24"},
    { item_number: '64-00263', item: 'Sea to Summit EtherLightXT Extreme mat Rect Reg Wide Black', normal_price: 2600, staff_price: 1040, round: "s2s_oct_24" },
    { item_number: '64-00264', item: 'Sea to Summit EtherLightXT Extreme mat Rect Large Black', normal_price: 2800, staff_price: 1120, round: "s2s_oct_24" },
    { item_number: '64-0035', item: 'Sea to Summit Comfort Light Self Inflating Regular Green', normal_price: 1100, staff_price: 440, round: "s2s_oct_24" },
    { item_number: '64-00352', item: "Sea to Summit Comfort Light SI Women's Regular Aegean", normal_price: 1100, staff_price: 440, round: "s2s_oct_24" },
    { Model_number: 23533, Model_name: 'Kajka 35 S/M', Farvekode: 228, Farve: 'Khaki Dust', Størrelse: '1 Size', Indkøbspris: 1715, Bar_code: 7323450842109, Product_Group: 'Backpacks and Bags', Køn: 'Women', round: "fjallraven_feb_24" },
    { Model_number: 23533, Model_name: 'Kajka 35 S/M', Farvekode: 525, Farve: 'UN Blue', Størrelse: '1 Size', Indkøbspris: 1715, Bar_code: 7323450842116, Product_Group: 'Backpacks and Bags', Køn: 'Women', round: "fjallraven_feb_24" },
    { Model_number: 23533, Model_name: 'Kajka 35 S/M', Farvekode: 620, Farve: 'Green', Størrelse: '1 Size', Indkøbspris: 1715, Bar_code: 7323450842123, Product_Group: 'Backpacks and Bags', Køn: 'Women', round: "fjallraven_feb_24" },
    { Model_number: 23533, Model_name: 'Kajka 35 S/M', Farvekode: 37, Farve: 'Coal Black', Størrelse: '1 Size', Indkøbspris: 1715, Bar_code: 7323450842093, Product_Group: 'Backpacks and Bags', Køn: 'Women', round: "fjallraven_feb_24" },
    { Model_number: 23534, Model_name: 'Kajka 35 M/L', Farvekode: 228, Farve: 'Khaki Dust', Størrelse: '1 Size', Indkøbspris: 1715, Bar_code: 7323450842147, Product_Group: 'Backpacks and Bags', Køn: 'Men', round: "fjallraven_feb_24" },
    { Model_number: 23534, Model_name: 'Kajka 35 M/L', Farvekode: 525, Farve: 'UN Blue', Størrelse: '1 Size', Indkøbspris: 1715, Bar_code: 7323450842154, Product_Group: 'Backpacks and Bags', Køn: 'Men', round: "fjallraven_feb_24" },
    { Model_number: 23534, Model_name: 'Kajka 35 M/L', Farvekode: 620, Farve: 'Green', Størrelse: '1 Size', Indkøbspris: 1715, Bar_code: 7323450842161, Product_Group: 'Backpacks and Bags', Køn: 'Men', round: "fjallraven_feb_24" },
    { Model_number: 23534, Model_name: 'Kajka 35 M/L', Farvekode: 37, Farve: 'Coal Black', Størrelse: '1 Size', Indkøbspris: 1715, Bar_code: 7323450842130, Product_Group: 'Backpacks and Bags', Køn: 'Men', round: "fjallraven_feb_24" },
    { Model_number: 23543, Model_name: 'Kajka Side Pocket', Farvekode: 228, Farve: 'Khaki Dust', Størrelse: '1 Size', Indkøbspris: 220, Bar_code: 7323450842185, Product_Group: 'Hardware Accessories', Køn: 'Unisex', round: "fjallraven_feb_24" },
    { Model_number: 23543, Model_name: 'Kajka Side Pocket', Farvekode: 525, Farve: 'UN Blue', Størrelse: '1 Size', Indkøbspris: 220, Bar_code: 7323450842192, Product_Group: 'Hardware Accessories', Køn: 'Unisex', round: "fjallraven_feb_24" },
    { Model_number: 23543, Model_name: 'Kajka Side Pocket', Farvekode: 620, Farve: 'Green', Størrelse: '1 Size', Indkøbspris: 220, Bar_code: 7323450842208, Product_Group: 'Hardware Accessories', Køn: 'Unisex', round: "fjallraven_feb_24" },
    { Model_number: 23543, Model_name: 'Kajka Side Pocket', Farvekode: 37, Farve: 'Coal Black', Størrelse: '1 Size', Indkøbspris: 220, Bar_code: 7323450842178, Product_Group: 'Hardware Accessories', Køn: 'Unisex', round: "fjallraven_feb_24" },
    { Model_number: 27097, Model_name: 'Kajka 100', Farvekode: 550, Farve: 'Black', Størrelse: '1 Size', Indkøbspris: 2160, Bar_code: 7392158958504, Product_Group: 'Backpacks and Bags', Køn: 'Unisex', round: "fjallraven_feb_24" },
    { Model_number: 27097, Model_name: 'Kajka 100', Farvekode: 660, Farve: 'Forest Green', Størrelse: '1 Size', Indkøbspris: 2160, Bar_code: 7392158958511, Product_Group: 'Backpacks and Bags', Køn: 'Unisex', round: "fjallraven_feb_24" },
    { Model_number: 27096, Model_name: 'Kajka 85', Farvekode: 550, Farve: 'Black', Størrelse: '1 Size', Indkøbspris: 2100, Bar_code: 7392158958412, Product_Group: 'Backpacks and Bags', Køn: 'Unisex', round: "fjallraven_feb_24" },
]);


await db.collection("orders").insertOne({
    "round": "s2s_oct_24",
    "isOpen": true,
    "softDeadline": "24-01-01"
  })
  await db.collection("orders").insertOne({
    "round": "fjallraven_feb_24",
    "isOpen": true,
    "softDeadline": "31-01-01"
  })

//Create users with roles
// await db.createCollection("users");
// await db.collection("users").insertOne({ name: "admin", email: "admin@admin.dk", staffNumber: "00", hashedPassword: '$2b$14$BVW5Ya2gyIi5c22yMfygxeJKWJCaV1JsJiCs7JEusGS8OjTbPmLvW', role: "ADMIN" })
