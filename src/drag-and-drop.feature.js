
const getWheel = (element) => element.shadowRoot.querySelector('.color-wheel')

export function getColorWheelCenterPoint(element){
    const wheel = getWheel(element)
    const wheelStyle = window.getComputedStyle(wheel)
    const pointerBox = wheel.getBoundingClientRect();
    const centerPoint = wheelStyle.transformOrigin;
    const centers = centerPoint.split(" ");
    const centerY = pointerBox.top + parseInt(centers[1]);
    const centerX = pointerBox.left + parseInt(centers[0]);
    return { x: centerX, y: centerY }
}


