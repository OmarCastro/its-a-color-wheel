
interface Rect {
    x: number
    y: number
    width: number
    height: number
}

interface Point {
    x: number
    y: number
}

export const calculateDistanceBetween2Points = ({x: x1, y: y1}: Point, {x: x2, y: y2}: Point) => Math.sqrt((x2 - x1)**2 + (y2 - y1)**2);

export const CircleInfo = {
    fromRectWithPercentInnerRadius(rect: Rect, innerRadiusPerc: number){
        const {x, y, width, height} = rect
        const radius = Math.min(width, height) / 2
        const innerRadius = (innerRadiusPerc * 0.01) * radius
        const center = {x: x + width/2, y: y + height/2}
        return { innerRadiusPerc, radius, innerRadius, center }
    },
    fromRectWithInnerRadius(rect:Rect, innerRadius: number){
        const {x, y, width, height} = rect
        const radius = Math.min(width, height) / 2
        const innerRadiusPerc = innerRadius * 100 / radius
        const center = {x: x + width/2, y: y + height/2}
        return { innerRadiusPerc, radius, innerRadius, center }
    }
}
