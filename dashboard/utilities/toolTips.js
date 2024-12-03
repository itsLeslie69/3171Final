import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
                                // Tooltip container, x co-ordindate, y co-ordindate, data, offset start, lone field to display, offests, additional display text
export function appendToolTip (container, xPos, height, dataParam, reverseValue = 0, singleField = "", xOffset = 0, yOffset = 0, fieldText = "") {
                                // reverseValue is never used - remove?
    //console.log('tooltip used!')

    // Append a foreignObject using d3 as div and g elements will not display
    // foreignObject overrides d3 styles, allowing for a div-like container
    let textContainer = container.append('foreignObject')
                                    .attr('id', 'tipContainer')
                                    .attr('class', 'toolTip')
                                    .attr('x', function () {
                                       if (reverseValue > 0) {  // Controlling offset
                                        return (xPos * -1) + xOffset    // Ex: if we offset on item/bar 3, tooltip moves to the left side to
                                       } else {                         // avoid going off the chart
                                        return xPos + xOffset   // Else, return position plus offset
                                       }
                                    })
                                    // 
                                    .attr('y', function () {
                                       return height + yOffset
                                    })
                                    .attr('width', 120)
                                    .attr('height', 80)
   
    
     // Append a div inside the foreignObject for better control and styling
     let tooltipDiv = textContainer.append('xhtml:div')
                                    .attr('class', 'toolTipBackground')

    
    if (fieldText) { // If we have a custom field, include it in the text
        tooltipDiv.append('div')
        .attr('class', 'toolTipText')
        .attr('class', 'tipSingleValue')
        .text(fieldText + ": " + singleField)
    } else {
        tooltipDiv.append('div')
        .attr('class', 'toolTipText')
        .attr('class', 'tipSingleValue')
        .text(singleField)  // Otherwise, just the given field is displayed
    }                               
}               