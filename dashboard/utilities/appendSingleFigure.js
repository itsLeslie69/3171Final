export default function appendSingleFigure (id, value) {
    let tempContainer = document.getElementById(id)
    if (!tempContainer) {
        console.log('Error - element not found')
    }

    let tempElement = document.getElementById(id)
    tempElement.innerText = value
}