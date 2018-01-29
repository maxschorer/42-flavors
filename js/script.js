/* Sets a random integer quantity in range [1, 20] for each flavor. */
function getRandomInt(n=20){
  return 1 + Math.floor(Math.random()*n);
}


function setQuantities() {
  const flavors = document.getElementsByClassName("flavor");
  let flavor, meta, child, span;

  for (let i = 0; i < flavors.length; i++){
    flavor = flavors[i];
    meta = flavor.getElementsByClassName("meta")[0];
    child = meta.firstChild;
    span = document.createElement("span");
    span.innerHTML = getRandomInt();
    span.classList.add("quantity");
    meta.insertBefore(span, child);
  }
}

/* Extracts and returns an array of flavor objects based on data in the DOM. Each
 * flavor object should contain five properties:
 *
 * element: the HTMLElement that corresponds to the .flavor div in the DOM
 * name: the name of the flavor
 * description: the description of the flavor
 * price: how much the flavor costs
 * quantity: how many cups of the flavor are available
 */
function extractFlavors() {
  let flavors = [];
  let flavor, flavorDiv, descriptionDiv, metaDiv, description, name, childNodes;
  const flavorDivs = document.getElementsByClassName("flavor");

  for (let i = 0; i < flavorDivs.length; i++){
    flavorDiv = flavorDivs[i]
    flavor = {}
    flavor["element"] = flavorDiv
    descriptionDiv = flavorDiv.getElementsByClassName("description")[0]
    flavor["name"] = descriptionDiv.getElementsByTagName("h2")[0].innerHTML
    flavor["description"] = descriptionDiv.getElementsByTagName("p")[0].innerHTML
    metaDiv = flavorDiv.getElementsByClassName("meta")[0]
    flavor["quantity"] = parseInt(metaDiv.getElementsByClassName("quantity")[0].innerHTML,10)
    flavor["price"] = parseFloat(metaDiv.getElementsByClassName("price")[0].innerHTML.slice(1))
    flavors.push(flavor)
  }
  return flavors
}

/* Calculates and returns the average price of the given set of flavors. The
 * average should be rounded to two decimal places. */
function calculateAveragePrice(flavors) {
  let totalSum = 0.0;

  flavors.forEach(function(flavor){
    totalSum += flavor.price
  })

  return (totalSum / flavors.length).toFixed(2)
}

/* Finds flavors that have prices below the given threshold. Returns an array
 * of strings, each of the form "[flavor] costs $[price]". There should be
 * one string for each cheap flavor. */
function findCheapFlavors(flavors, threshold) {
  return flavors.filter(flavor => flavor.price < threshold).map(f => f.name + " costs $" + f.price)
}

/* Populates the select dropdown with options. There should be one option tag
 * for each of the given flavors. */
function populateOptions(flavors) {
  const select = document.getElementsByTagName("select")[0]
  select.innerHTML = ""
  for (let i = 0; i < flavors.length; i++){
    option = document.createElement("option")
    option.innerHTML = flavors[i].name
    option.setAttribute("value", String(i))
    select.appendChild(option)
  }
}

/* Processes orders for the given set of flavors. When a valid order is made,
 * decrements the quantity of the associated flavor. */
function processOrders(flavors) {
  let form = document.getElementsByTagName("form")[0]
  form.addEventListener("submit", (event) =>{
    event.preventDefault()
    let input = form.getElementsByTagName("input")[0]
    let quantity = parseInt(input.value,10)
    if (isNaN(quantity)){return}
    let select = form.getElementsByTagName("select")[0]
    let flavorIndex = select.value

    let flavorDiv = flavors[flavorIndex].element
    //console.log(flavorDiv)
    let flavorQuantity = flavorDiv.getElementsByClassName("meta")[0].getElementsByClassName("quantity")[0]
    let curQuantity = parseInt(flavorQuantity.innerHTML)
    if (quantity > curQuantity) {return};
    flavorQuantity.innerHTML = (curQuantity - quantity);
    input.value = ""
  })

}

/* Highlights flavors when clicked to make a simple favoriting system. */
function highlightFlavors(flavors) {
  for (let i = 0; i < flavors.length; i++){
    let elem = flavors[i].element
    elem.addEventListener("click", event => {
      let classes = elem.classList
      if (classes[classes.length-1] === "highlighted"){
        classes.remove("highlighted")
      } else {
        classes.add("highlighted")
      }
    })
  }
}


/***************************************************************************/
/*                                                                         */
/* Please do not modify code below this line, but feel free to examine it. */
/*                                                                         */
/***************************************************************************/


const CHEAP_PRICE_THRESHOLD = 1.50

// setting quantities can modify the size of flavor divs, so apply the grid
// layout *after* quantities have been set.
setQuantities()
const container = document.getElementById('container')
new Masonry(container, { itemSelector: '.flavor' })

// calculate statistics about flavors
const flavors = extractFlavors()
const averagePrice = calculateAveragePrice(flavors)
console.log('Average price:', averagePrice)

const cheapFlavors = findCheapFlavors(flavors, CHEAP_PRICE_THRESHOLD)
console.log('Cheap flavors:', cheapFlavors)

// handle flavor orders and highlighting
populateOptions(flavors)
processOrders(flavors)
highlightFlavors(flavors)
