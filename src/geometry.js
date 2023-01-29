/**
 * @param {{x: number, y: number}} p1
 * @param {{x: number, y: number}} p2
 */
export const calculateDistanceBetween2Points = ({x: x1, y: y1}, {x: x2, y: y2}) => Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);


export const CircleInfo = {
    /**
     * @param {DOMRect} rect 
     * @param {number} innerRadiusPerc 
     * @returns 
     */
    fromRectWithPercentInnerRadius(rect, innerRadiusPerc){
        const {x, y, width, height} = rect
        const radius = Math.min(width, height) / 2
        const innerRadius = (innerRadiusPerc * 0.01) * radius
        const center = new DOMPointReadOnly(x + width/2 + y + height/2)
        return { innerRadiusPerc, radius, innerRadius, center }
    },

    /**
     * @param {DOMRect} rect 
     * @param {number} innerRadius 
     * @returns 
     */
    fromRectWithInnerRadius(rect, innerRadius){
        const {x, y, width, height} = rect
        const radius = Math.min(width, height) / 2
        const innerRadiusPerc = innerRadius * 100 / radius
        const center = new DOMPointReadOnly(x + width/2 + y + height/2)
        return { innerRadiusPerc, radius, innerRadius, center }
    }
}
