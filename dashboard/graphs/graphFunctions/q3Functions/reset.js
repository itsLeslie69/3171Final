import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"


export default function resetGraph () {
    d3.select('#gGroup') 
    .selectAll('g')
    .filter(function() {
        return !this.hasAttribute('class');
    })
    .remove();


}