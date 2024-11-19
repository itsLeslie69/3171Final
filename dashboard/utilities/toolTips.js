import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function appendStackedBarToolTip (svgContainer, svgHeight, xPos, data, colourHexArray = [], reverseValue = 0, singleField = "", xOffSet = 0, customSort = [], yOffSet = 0) {
    let tempDataArray = Object.entries(data)
    //console.log(tempDataArray)
    //console.log(data)
    

    let textContainer = svgContainer.append('foreignObject')
                                    .attr('id', 'tipContainer')
                                    .attr('class', 'toolTip')
                                    .attr('x', function () {
                                        if (customSort != [] && reverseValue == 0) {
                                            return xPos + (customSort.indexOf(data[0]) * xOffSet)
                                        } else if (tempDataArray[0][1] >= reverseValue) {
                                            return xPos - (xPos/2) - (svgHeight/6) + xOffSet
                                        } else  {
                                            return xPos
                                        }
                                    })
                                    // 
                                    .attr('y', function () {
                                        if (yOffSet == 0) {
                                            return svgHeight - (svgHeight / 3) - 90
                                        } else if (yOffSet !== 0) {
                                            return yOffSet
                                        }
                                    })
                                    .attr('width', 220)
                                    .attr('height', 190)
   
    
     // Append a div inside the foreignObject for better control and styling
     let tooltipDiv = textContainer.append('xhtml:div')
                                    .attr('class', 'toolTipBackground')

    if (tempDataArray.length > 1) {
        
            if (singleField != "") {
                tooltipDiv.append('div')
                .attr('class', 'toolTipText')
                .attr('class', 'tipSingleValue')
                .text(singleField)
                return
            }

            tooltipDiv.append('div')
                .attr('class', 'toolTipTitle')
                .text(tempDataArray[0][0])

            for (let i = 1; i < tempDataArray.length; i++) {
                tooltipDiv.append('div')
                                .attr('class', 'toolTipText')
                                .text(tempDataArray[i][0] + ": " + tempDataArray[i][1])
                                //.style('color', colourHexArray[(i - 1) % colourHexArray.length])
            }
        
    } else {
        tooltipDiv.append('div')
            .text(tempDataArray[0])
            .attr('class', 'toolTipText')
            return
        }
                                
}

export function appendPieChartToolTip (svgContainer, svgHeight, xPos, data, colourHexArray = [], singleField = "", xOffSet = 0, yOffSet = 0) {
    let tempDataArray = Object.entries(data)
    //console.log(tempDataArray)
    //console.log(data)

    let textContainer = svgContainer.append('foreignObject')
                                    .attr('id', 'tipContainer')
                                    .attr('class', 'toolTip')
                                    .attr('x', function () {
                                            if (xOffSet == 0) {
                                                return xPos
                                            } else if (xOffSet >0  && data.index == 1) {
                                                return xPos
                                            } else if (xOffSet > 0) {
                                                return xPos + xOffSet
                                            }
                                    })
                                    // 
                                    .attr('y', function () {
                                        if (yOffSet == 0) {
                                            return svgHeight - (svgHeight / 3) - 90
                                        } else if (yOffSet !== 0) {
                                            return yOffSet
                                        }
                                    })
                                    .attr('width', 170)
                                    .attr('height', 150)
   
    
     // Append a div inside the foreignObject for better control and styling
     let tooltipDiv = textContainer.append('xhtml:div')
                                    .attr('class', 'toolTipBackground')
                                    //.style('font', '12px sans-serif') 
                                    //.style('background', 'lightgrey') 
                                    //.style('padding', '5px') 
                                    //.style('border-radius', '4px')

    if (tempDataArray.length > 1) {
        
            if (singleField != "") {
                tooltipDiv.append('div')
                .attr('class', 'toolTipText')
                .attr('class', 'tipSingleValue')
                .text(singleField)
                return
            }

            tooltipDiv.append('div')
                .text(tempDataArray[0][0])
                .attr('class', 'toolTipText')

            for (let i = 1; i < tempDataArray.length; i++) {
                tooltipDiv.append('div')
                                .text(tempDataArray[i][0] + ": " + tempDataArray[i][1])
                                .style('color', colourHexArray[(i - 1) % colourHexArray.length])
            }
        
    } else {
        tooltipDiv.append('div')
            .text(tempDataArray[0])
            .attr('class', 'toolTipText')
            return
        }
                    
}