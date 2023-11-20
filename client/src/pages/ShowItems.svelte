<script>


    const items = [
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
    ];
    
    // forsøg med en anden type af items og om det kan vises


    // const items = [
    //   { model_number: 23, model_name: 'kajka', kon: 'woman', farvekode: 228, felt3: 3, felt4: 4 }
    // ]
    
    const headerKeys = items.length > 0 ? Object.keys(items[0]) : [];
    
    const itemKey = items.length > 0 ? Object.keys(items[0])[0] : '';
    
    let quantityValues = {};
    
    function handleQuantityChange(AB_item_number, event) {
      const value = parseInt(event.target.value) || 0;
      quantityValues = {
        ...quantityValues,
        [AB_item_number]: value,
      };
    }
    
    function printQuantities() {
      console.log("Quantity Values:", quantityValues);
    }
    </script>
    
    <main>
      <h1>List of Items</h1>
    
      <table>
        <thead>
          <tr>
            {#each headerKeys as key (key)}
              <th>{key}</th>
            {/each}
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {#each items as item (item[itemKey])}
            <tr>
              {#each headerKeys as key (key)}
                <td>{item[key]}</td>
              {/each}
              <td>
                <input
                  type="number"
                  value={quantityValues[item[itemKey]] || ''}
                  on:input={(event) => handleQuantityChange(item[itemKey], event)}
                />
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    
      <button on:click={printQuantities}>Print Quantities</button>
    </main>